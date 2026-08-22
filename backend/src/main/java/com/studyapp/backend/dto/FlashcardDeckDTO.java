package com.studyapp.backend.dto;

import com.studyapp.backend.entity.FlashcardDeck;

public class FlashcardDeckDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String title;
    private int cardCount;
    private int dueCount;

    public static FlashcardDeckDTO from(FlashcardDeck deck, int cardCount) {
        return from(deck, cardCount, 0);
    }

    public static FlashcardDeckDTO from(FlashcardDeck deck, int cardCount, int dueCount) {
        FlashcardDeckDTO dto = new FlashcardDeckDTO();
        dto.id = deck.getId();
        if (deck.getSubject() != null) {
            dto.subjectId = deck.getSubject().getId();
            dto.subjectName = deck.getSubject().getName();
        }
        dto.title = deck.getTitle();
        dto.cardCount = cardCount;
        dto.dueCount = dueCount;
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public String getTitle() {
        return title;
    }

    public int getCardCount() {
        return cardCount;
    }

    public int getDueCount() {
        return dueCount;
    }
}
