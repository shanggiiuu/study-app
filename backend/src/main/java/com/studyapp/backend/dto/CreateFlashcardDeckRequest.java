package com.studyapp.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateFlashcardDeckRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private Long subjectId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
}
