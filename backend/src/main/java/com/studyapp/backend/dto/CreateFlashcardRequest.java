package com.studyapp.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateFlashcardRequest {

    @NotBlank(message = "Front text is required")
    private String front;

    @NotBlank(message = "Back text is required")
    private String back;

    public String getFront() {
        return front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return back;
    }

    public void setBack(String back) {
        this.back = back;
    }
}
