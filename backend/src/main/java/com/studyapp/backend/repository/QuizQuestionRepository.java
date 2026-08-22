package com.studyapp.backend.repository;

import com.studyapp.backend.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizIdOrderByCreatedAtAsc(Long quizId);

    int countByQuizId(Long quizId);
}
