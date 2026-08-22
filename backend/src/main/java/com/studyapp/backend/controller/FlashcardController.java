package com.studyapp.backend.controller;

import com.studyapp.backend.dto.*;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.FlashcardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flashcard-decks")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @GetMapping
    public ResponseEntity<List<FlashcardDeckDTO>> listDecks() {
        return ResponseEntity.ok(flashcardService.listDecks(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlashcardDeckDTO> getDeck(@PathVariable Long id) {
        return ResponseEntity.ok(flashcardService.getDeck(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<FlashcardDeckDTO> createDeck(@Valid @RequestBody CreateFlashcardDeckRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flashcardService.createDeck(CurrentUser.id(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeck(@PathVariable Long id) {
        flashcardService.deleteDeck(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/cards")
    public ResponseEntity<List<FlashcardDTO>> listCards(@PathVariable Long id) {
        return ResponseEntity.ok(flashcardService.listCards(CurrentUser.id(), id));
    }

    @PostMapping("/{id}/cards")
    public ResponseEntity<FlashcardDTO> addCard(@PathVariable Long id, @Valid @RequestBody CreateFlashcardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flashcardService.addCard(CurrentUser.id(), id, request));
    }

    @PutMapping("/{id}/cards/{cardId}")
    public ResponseEntity<FlashcardDTO> updateCard(@PathVariable Long id, @PathVariable Long cardId,
                                                     @Valid @RequestBody CreateFlashcardRequest request) {
        return ResponseEntity.ok(flashcardService.updateCard(CurrentUser.id(), id, cardId, request));
    }

    @DeleteMapping("/{id}/cards/{cardId}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id, @PathVariable Long cardId) {
        flashcardService.deleteCard(CurrentUser.id(), id, cardId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cards/{cardId}/review")
    public ResponseEntity<FlashcardDTO> reviewCard(@PathVariable Long id, @PathVariable Long cardId,
                                                     @RequestParam int quality) {
        return ResponseEntity.ok(flashcardService.reviewCard(CurrentUser.id(), id, cardId, quality));
    }

    @GetMapping("/{id}/cards/due")
    public ResponseEntity<List<FlashcardDTO>> listDueCards(@PathVariable Long id) {
        return ResponseEntity.ok(flashcardService.listDueCards(CurrentUser.id(), id));
    }
}
