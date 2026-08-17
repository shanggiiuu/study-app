package com.studyapp.backend.service;

import com.studyapp.backend.dto.StartStudySessionRequest;
import com.studyapp.backend.dto.StudySessionDTO;
import com.studyapp.backend.entity.StudySession;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.StudySessionRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class StudySessionService {

    private final StudySessionRepository studySessionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public StudySessionService(StudySessionRepository studySessionRepository, SubjectRepository subjectRepository,
                                UserRepository userRepository) {
        this.studySessionRepository = studySessionRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<StudySessionDTO> listForUser(Long userId) {
        return studySessionRepository.findByUserIdOrderByStartTimeDesc(userId).stream()
                .map(StudySessionDTO::from)
                .toList();
    }

    @Transactional
    public StudySessionDTO start(Long userId, StartStudySessionRequest request) {
        studySessionRepository.findByUserIdAndEndTimeIsNull(userId).ifPresent(s -> {
            throw new IllegalArgumentException("A study session is already in progress");
        });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudySession session = new StudySession();
        session.setUser(user);
        session.setStartTime(Instant.now());
        session.setEndTime(null);

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            session.setSubject(subject);
        }

        return StudySessionDTO.from(studySessionRepository.save(session));
    }

    @Transactional
    public StudySessionDTO stop(Long userId, Long sessionId) {
        StudySession session = findOwned(userId, sessionId);
        Instant now = Instant.now();
        session.setEndTime(now);
        session.setDurationMinutes((int) Duration.between(session.getStartTime(), now).toMinutes());
        return StudySessionDTO.from(studySessionRepository.save(session));
    }

    @Transactional
    public void delete(Long userId, Long sessionId) {
        StudySession session = findOwned(userId, sessionId);
        studySessionRepository.delete(session);
    }

    private StudySession findOwned(Long userId, Long sessionId) {
        return studySessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found"));
    }
}
