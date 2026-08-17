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
        return deckRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(deck -> FlashcardDeckDTO.from(deck, cardRepository.findByDeckIdOrderByCreatedAtAsc(deck.getId()).size()))
                .toList();
    }

    public FlashcardDeckDTO getDeck(Long userId, Long deckId) {
        FlashcardDeck deck = findOwnedDeck(userId, deckId);
        return FlashcardDeckDTO.from(deck, cardRepository.findByDeckIdOrderByCreatedAtAsc(deck.getId()).size());
    }

    public List<FlashcardDTO> listCards(Long userId, Long deckId) {
        findOwnedDeck(userId, deckId);
        return cardRepository.findByDeckIdOrderByCreatedAtAsc(deckId).stream()
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
    public FlashcardDTO reviewCard(Long userId, Long deckId, Long cardId, boolean correct) {
        findOwnedDeck(userId, deckId);
        Flashcard card = findOwnedCard(deckId, cardId);
        if (correct) {
            card.setBox(Math.min(5, card.getBox() + 1));
        } else {
            card.setBox(1);
        }
        return FlashcardDTO.from(cardRepository.save(card));
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
