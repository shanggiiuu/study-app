package com.studyapp.backend.repository;

import com.studyapp.backend.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByUserIdOrderByExamDateAsc(Long userId);

    Optional<Exam> findByIdAndUserId(Long id, Long userId);
}
