package com.studyapp.backend.repository;

import com.studyapp.backend.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserIdOrderByStartTimeDesc(Long userId);

    Optional<StudySession> findByUserIdAndEndTimeIsNull(Long userId);

    Optional<StudySession> findByIdAndUserId(Long id, Long userId);
}
