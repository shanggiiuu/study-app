package com.studyapp.backend.repository;

import com.studyapp.backend.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByUserIdOrderByStartTimeAsc(Long userId);

    List<CalendarEvent> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(Long userId, Instant from, Instant to);

    Optional<CalendarEvent> findByIdAndUserId(Long id, Long userId);
}
