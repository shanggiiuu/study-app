package com.studyapp.backend.service;

import com.studyapp.backend.dto.CalendarEventDTO;
import com.studyapp.backend.dto.CreateCalendarEventRequest;
import com.studyapp.backend.entity.CalendarEvent;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.CalendarEventRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
public class CalendarEventService {

    private static final Set<String> ALLOWED_TYPES = Set.of("CLASS", "EXAM", "STUDY", "DEADLINE", "OTHER");

    private final CalendarEventRepository calendarEventRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public CalendarEventService(CalendarEventRepository calendarEventRepository, SubjectRepository subjectRepository,
                                 UserRepository userRepository) {
        this.calendarEventRepository = calendarEventRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<CalendarEventDTO> listForUser(Long userId, Instant from, Instant to) {
        List<CalendarEvent> events;
        if (from != null && to != null) {
            events = calendarEventRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(userId, from, to);
        } else {
            events = calendarEventRepository.findByUserIdOrderByStartTimeAsc(userId);
        }
        return events.stream().map(CalendarEventDTO::from).toList();
    }

    public CalendarEventDTO getOne(Long userId, Long eventId) {
        return CalendarEventDTO.from(findOwned(userId, eventId));
    }

    @Transactional
    public CalendarEventDTO create(Long userId, CreateCalendarEventRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CalendarEvent event = new CalendarEvent();
        event.setUser(user);
        applyRequest(userId, event, request);

        return CalendarEventDTO.from(calendarEventRepository.save(event));
    }

    @Transactional
    public CalendarEventDTO update(Long userId, Long eventId, CreateCalendarEventRequest request) {
        CalendarEvent event = findOwned(userId, eventId);
        applyRequest(userId, event, request);
        return CalendarEventDTO.from(calendarEventRepository.save(event));
    }

    @Transactional
    public void delete(Long userId, Long eventId) {
        CalendarEvent event = findOwned(userId, eventId);
        calendarEventRepository.delete(event);
    }

    private CalendarEvent findOwned(Long userId, Long eventId) {
        return calendarEventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar event not found"));
    }

    private void applyRequest(Long userId, CalendarEvent event, CreateCalendarEventRequest request) {
        event.setTitle(request.getTitle());

        String type = request.getType();
        if (type == null || type.isBlank()) {
            type = "OTHER";
        } else {
            type = type.toUpperCase();
            if (!ALLOWED_TYPES.contains(type)) {
                throw new IllegalArgumentException("Invalid event type: " + type);
            }
        }
        event.setType(type);

        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            event.setSubject(subject);
        } else {
            event.setSubject(null);
        }
    }
}
