package com.studyapp.backend.service;

import com.studyapp.backend.dto.*;
import com.studyapp.backend.entity.Flashcard;
import com.studyapp.backend.entity.FlashcardDeck;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.FlashcardDeckRepository;
import com.studyapp.backend.repository.FlashcardRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FlashcardService {

    private final FlashcardDeckRepository deckRepository;
    private final FlashcardRepository cardRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public FlashcardService(FlashcardDeckRepository deckRepository, FlashcardRepository cardRepository,
                             SubjectRepository subjectRepository, UserRepository userRepository) {
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<FlashcardDeckDTO> listDecks(Long userId) {
        LocalDate today = LocalDate.now();
        return deckRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(deck -> FlashcardDeckDTO.from(deck,
                        cardRepository.findByDeckIdOrderByCreatedAtAsc(deck.getId()).size(),
                        cardRepository.countByDeckIdAndNextReviewDateLessThanEqual(deck.getId(), today)))
                .toList();
    }

    public FlashcardDeckDTO getDeck(Long userId, Long deckId) {
        FlashcardDeck deck = findOwnedDeck(userId, deckId);
        return FlashcardDeckDTO.from(deck,
                cardRepository.findByDeckIdOrderByCreatedAtAsc(deck.getId()).size(),
                cardRepository.countByDeckIdAndNextReviewDateLessThanEqual(deck.getId(), LocalDate.now()));
    }

    public List<FlashcardDTO> listCards(Long userId, Long deckId) {
        findOwnedDeck(userId, deckId);
        return cardRepository.findByDeckIdOrderByCreatedAtAsc(deckId).stream()
                .map(FlashcardDTO::from)
                .toList();
    }

    public List<FlashcardDTO> listDueCards(Long userId, Long deckId) {
        findOwnedDeck(userId, deckId);
        return cardRepository.findByDeckIdAndNextReviewDateLessThanEqualOrderByNextReviewDateAsc(deckId, LocalDate.now()).stream()
                .map(FlashcardDTO::from)
                .toList();
    }

    @Transactional
    public FlashcardDeckDTO createDeck(Long userId, CreateFlashcardDeckRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FlashcardDeck deck = new FlashcardDeck();
        deck.setUser(user);
        deck.setTitle(request.getTitle());
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            deck.setSubject(subject);
        }

        deck = deckRepository.save(deck);
        return FlashcardDeckDTO.from(deck, 0);
    }

    @Transactional
    public void deleteDeck(Long userId, Long deckId) {
        deckRepository.delete(findOwnedDeck(userId, deckId));
    }

    @Transactional
    public FlashcardDTO addCard(Long userId, Long deckId, CreateFlashcardRequest request) {
        FlashcardDeck deck = findOwnedDeck(userId, deckId);

        Flashcard card = new Flashcard();
        card.setDeck(deck);
        card.setFront(request.getFront());
        card.setBack(request.getBack());

        return FlashcardDTO.from(cardRepository.save(card));
    }

    @Transactional
    public FlashcardDTO updateCard(Long userId, Long deckId, Long cardId, CreateFlashcardRequest request) {
        findOwnedDeck(userId, deckId);
        Flashcard card = findOwnedCard(deckId, cardId);
        card.setFront(request.getFront());
        card.setBack(request.getBack());
        return FlashcardDTO.from(cardRepository.save(card));
    }

    @Transactional
    public void deleteCard(Long userId, Long deckId, Long cardId) {
        findOwnedDeck(userId, deckId);
        cardRepository.delete(findOwnedCard(deckId, cardId));
    }

    @Transactional
    public FlashcardDTO reviewCard(Long userId, Long deckId, Long cardId, int quality) {
        findOwnedDeck(userId, deckId);
        Flashcard card = findOwnedCard(deckId, cardId);
        applySm2(card, quality);
        card.setBox(quality < 3 ? 1 : Math.min(5, card.getBox() + 1));
        return FlashcardDTO.from(cardRepository.save(card));
    }

    /** Standard SM-2 spaced-repetition update. quality is 0-5 (recall confidence). */
    private void applySm2(Flashcard card, int quality) {
        quality = Math.max(0, Math.min(5, quality));
        double ease = card.getEaseFactor() + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        card.setEaseFactor(Math.max(1.3, ease));

        if (quality < 3) {
            card.setRepetitions(0);
            card.setIntervalDays(1);
        } else {
            int repetitions = card.getRepetitions() + 1;
            card.setRepetitions(repetitions);
            int interval = switch (repetitions) {
                case 1 -> 1;
                case 2 -> 6;
                default -> (int) Math.round(card.getIntervalDays() * card.getEaseFactor());
            };
            card.setIntervalDays(Math.max(1, interval));
        }
        card.setNextReviewDate(LocalDate.now().plusDays(card.getIntervalDays()));
    }

    /** Bulk-creates a new deck with AI-generated cards (used by the document generation flow). */
    @Transactional
    public FlashcardDeckDTO createDeckWithCards(Long userId, String title, Long subjectId, List<String[]> frontBackPairs) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FlashcardDeck deck = new FlashcardDeck();
        deck.setUser(user);
        deck.setTitle(title);
        if (subjectId != null) {
            Subject subject = subjectRepository.findByIdAndUserId(subjectId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            deck.setSubject(subject);
        }
        deck = deckRepository.save(deck);

        for (String[] pair : frontBackPairs) {
            Flashcard card = new Flashcard();
            card.setDeck(deck);
            card.setFront(pair[0]);
            card.setBack(pair[1]);
            cardRepository.save(card);
        }

        return FlashcardDeckDTO.from(deck, frontBackPairs.size(), frontBackPairs.size());
    }

    private FlashcardDeck findOwnedDeck(Long userId, Long deckId) {
        return deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard deck not found"));
    }

    private Flashcard findOwnedCard(Long deckId, Long cardId) {
        return cardRepository.findByIdAndDeckId(cardId, deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard not found"));
    }
}
