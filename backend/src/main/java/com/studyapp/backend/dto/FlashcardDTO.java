package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Flashcard;

public class FlashcardDTO {
    private Long id;
    private Long deckId;
    private String front;
    private String back;
    private int box;

    public static FlashcardDTO from(Flashcard card) {
        FlashcardDTO dto = new FlashcardDTO();
        dto.id = card.getId();
        dto.deckId = card.getDeck().getId();
        dto.front = card.getFront();
        dto.back = card.getBack();
        dto.box = card.getBox();
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
}
