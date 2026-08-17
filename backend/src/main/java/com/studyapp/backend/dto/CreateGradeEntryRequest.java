package com.studyapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class CreateGradeEntryRequest {

    @NotBlank(message = "Label is required")
    private String label;

    @NotNull(message = "Score is required")
    @PositiveOrZero(message = "Score must be zero or positive")
    private Double score;

    @NotNull(message = "Max score is required")
    @Positive(message = "Max score must be positive")
    private Double maxScore;

    private Double weight = 1.0;

    private String category;

    @NotNull(message = "Date is required")
    private LocalDate date;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Double maxScore) {
        this.maxScore = maxScore;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
