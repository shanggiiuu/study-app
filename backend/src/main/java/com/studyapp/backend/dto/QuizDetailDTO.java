package com.studyapp.backend.dto;

import java.util.List;

public class QuizDetailDTO {
    private QuizDTO quiz;
    private List<QuizQuestionDTO> questions;

    public static QuizDetailDTO of(QuizDTO quiz, List<QuizQuestionDTO> questions) {
        QuizDetailDTO dto = new QuizDetailDTO();
        dto.quiz = quiz;
        dto.questions = questions;
        return dto;
    }

    public QuizDTO getQuiz() {
        return quiz;
    }

    public List<QuizQuestionDTO> getQuestions() {
        return questions;
    }
}
