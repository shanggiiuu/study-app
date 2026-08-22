package com.studyapp.backend.repository;

import com.studyapp.backend.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Quiz> findByIdAndUserId(Long id, Long userId);
}
