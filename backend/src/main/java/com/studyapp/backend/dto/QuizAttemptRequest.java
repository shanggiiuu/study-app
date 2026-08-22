package com.studyapp.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

public class QuizAttemptRequest {
    @NotNull
    private Map<Long, String> answers;

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
