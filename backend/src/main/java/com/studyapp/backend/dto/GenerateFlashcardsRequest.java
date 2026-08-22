package com.studyapp.backend.dto;

public class GenerateFlashcardsRequest {
    private int count = 12;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
