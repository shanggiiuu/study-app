package com.studyapp.backend.dto;

public class GenerateQuizRequest {
    private int count = 8;
    private String type = "MIXED"; // MCQ | FILL_BLANK | MIXED

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
