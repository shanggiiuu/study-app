package com.studyapp.backend.repository;

import com.studyapp.backend.entity.FlashcardDeck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlashcardDeckRepository extends JpaRepository<FlashcardDeck, Long> {
    List<FlashcardDeck> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<FlashcardDeck> findByIdAndUserId(Long id, Long userId);
}
