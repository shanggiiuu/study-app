package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Quiz;

import java.time.Instant;

public class QuizDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private Long documentId;
    private String title;
    private int questionCount;
    private Instant createdAt;

    public static QuizDTO from(Quiz quiz, int questionCount) {
        QuizDTO dto = new QuizDTO();
        dto.id = quiz.getId();
        if (quiz.getSubject() != null) {
            dto.subjectId = quiz.getSubject().getId();
            dto.subjectName = quiz.getSubject().getName();
        }
        if (quiz.getDocument() != null) {
            dto.documentId = quiz.getDocument().getId();
        }
        dto.title = quiz.getTitle();
        dto.questionCount = questionCount;
        dto.createdAt = quiz.getCreatedAt();
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

    public Long getDocumentId() {
        return documentId;
    }

    public String getTitle() {
        return title;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
