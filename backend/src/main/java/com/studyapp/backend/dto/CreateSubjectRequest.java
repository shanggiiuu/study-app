package com.studyapp.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSubjectRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String iconKey;
    private String colorKey;
    private Integer credits;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIconKey() {
        return iconKey;
    }

    public void setIconKey(String iconKey) {
        this.iconKey = iconKey;
    }

    public String getColorKey() {
        return colorKey;
    }

    public void setColorKey(String colorKey) {
        this.colorKey = colorKey;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }
}
