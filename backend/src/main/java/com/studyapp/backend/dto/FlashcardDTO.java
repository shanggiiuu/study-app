package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Flashcard;

import java.time.LocalDate;

public class FlashcardDTO {
    private Long id;
    private Long deckId;
    private String front;
    private String back;
    private int box;
    private LocalDate nextReviewDate;
    private boolean due;

    public static FlashcardDTO from(Flashcard card) {
        FlashcardDTO dto = new FlashcardDTO();
        dto.id = card.getId();
        dto.deckId = card.getDeck().getId();
        dto.front = card.getFront();
        dto.back = card.getBack();
        dto.box = card.getBox();
        dto.nextReviewDate = card.getNextReviewDate();
        dto.due = !card.getNextReviewDate().isAfter(LocalDate.now());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getDeckId() {
        return deckId;
    }

    public String getFront() {
        return front;
    }

    public String getBack() {
        return back;
    }

    public int getBox() {
        return box;
    }

    public LocalDate getNextReviewDate() {
        return nextReviewDate;
    }

    public boolean isDue() {
        return due;
    }
}
