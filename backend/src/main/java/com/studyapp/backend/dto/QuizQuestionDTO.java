package com.studyapp.backend.dto;

import com.studyapp.backend.entity.QuizQuestion;

import java.util.List;

public class QuizQuestionDTO {
    private Long id;
    private String type;
    private String question;
    private List<String> options;
    private String correctAnswer;
    private String explanation;

    public static QuizQuestionDTO from(QuizQuestion question, List<String> options) {
        QuizQuestionDTO dto = new QuizQuestionDTO();
        dto.id = question.getId();
        dto.type = question.getType();
        dto.question = question.getQuestion();
        dto.options = options;
        dto.correctAnswer = question.getCorrectAnswer();
        dto.explanation = question.getExplanation();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getQuestion() {
        return question;
    }

    public List<String> getOptions() {
        return options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }
}
