package com.studyapp.backend.dto;

import com.studyapp.backend.entity.GradeEntry;

import java.time.LocalDate;

public class GradeEntryDTO {
    private Long id;
    private Long subjectId;
    private String label;
    private double score;
    private double maxScore;
    private double weight;
    private String category;
    private LocalDate date;

    public static GradeEntryDTO from(GradeEntry entry) {
        GradeEntryDTO dto = new GradeEntryDTO();
        dto.id = entry.getId();
        dto.subjectId = entry.getSubject().getId();
        dto.label = entry.getLabel();
        dto.score = entry.getScore();
        dto.maxScore = entry.getMaxScore();
        dto.weight = entry.getWeight();
        dto.category = entry.getCategory();
        dto.date = entry.getDate();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getLabel() {
        return label;
    }

    public double getScore() {
        return score;
    }

    public double getMaxScore() {
        return maxScore;
    }

    public double getWeight() {
        return weight;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getDate() {
        return date;
    }
}
