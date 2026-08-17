package com.studyapp.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class UpdateSettingsRequest {

    @NotNull(message = "Weekly study goal is required")
    @Min(value = 0, message = "Weekly study goal must be zero or positive")
    private Integer weeklyStudyGoalMinutes;

    @NotNull(message = "Theme is required")
    @Pattern(regexp = "light|dark", message = "Theme must be light or dark")
    private String theme;

    public Integer getWeeklyStudyGoalMinutes() {
        return weeklyStudyGoalMinutes;
    }

    public void setWeeklyStudyGoalMinutes(Integer weeklyStudyGoalMinutes) {
        this.weeklyStudyGoalMinutes = weeklyStudyGoalMinutes;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}
