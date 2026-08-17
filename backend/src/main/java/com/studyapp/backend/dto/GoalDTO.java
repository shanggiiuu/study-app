package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Goal;

import java.time.Instant;
import java.time.LocalDate;

public class GoalDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate targetDate;
    private Integer progressPercent;
    private String status;
    private Instant createdAt;

    public static GoalDTO from(Goal goal) {
        GoalDTO dto = new GoalDTO();
        dto.id = goal.getId();
        dto.title = goal.getTitle();
        dto.description = goal.getDescription();
        dto.targetDate = goal.getTargetDate();
        dto.progressPercent = goal.getProgressPercent();
        dto.status = goal.getStatus();
        dto.createdAt = goal.getCreatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
