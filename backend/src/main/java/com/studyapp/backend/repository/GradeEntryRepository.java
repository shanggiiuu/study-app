package com.studyapp.backend.repository;

import com.studyapp.backend.entity.GradeEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GradeEntryRepository extends JpaRepository<GradeEntry, Long> {
    List<GradeEntry> findBySubjectIdOrderByDateDesc(Long subjectId);

    Optional<GradeEntry> findByIdAndSubjectId(Long id, Long subjectId);

    List<GradeEntry> findBySubjectUserIdOrderByDateDesc(Long userId);

    List<GradeEntry> findBySubjectUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}
