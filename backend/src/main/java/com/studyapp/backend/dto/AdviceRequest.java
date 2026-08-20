package com.studyapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdviceRequest {
    @NotBlank(message = "A question is required")
    @Size(max = 2000, message = "Question must be at most 2000 characters")
    private String question;
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
