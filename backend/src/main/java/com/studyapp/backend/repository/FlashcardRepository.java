package com.studyapp.backend.repository;

import com.studyapp.backend.entity.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByDeckIdOrderByCreatedAtAsc(Long deckId);

    Optional<Flashcard> findByIdAndDeckId(Long id, Long deckId);

    List<Flashcard> findByDeckIdAndNextReviewDateLessThanEqualOrderByNextReviewDateAsc(Long deckId, LocalDate date);

    int countByDeckIdAndNextReviewDateLessThanEqual(Long deckId, LocalDate date);
}
