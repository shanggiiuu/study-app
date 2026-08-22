package com.studyapp.backend.dto;

import java.util.List;

public class QuizAttemptResult {
    private int score;
    private int total;
    private List<QuestionResult> results;

    public static QuizAttemptResult of(int score, int total, List<QuestionResult> results) {
        QuizAttemptResult result = new QuizAttemptResult();
        result.score = score;
        result.total = total;
        result.results = results;
        return result;
    }

    public int getScore() {
        return score;
    }

    public int getTotal() {
        return total;
    }

    public List<QuestionResult> getResults() {
        return results;
    }

    public static class QuestionResult {
        private Long questionId;
        private boolean correct;
        private String correctAnswer;
        private String explanation;

        public static QuestionResult of(Long questionId, boolean correct, String correctAnswer, String explanation) {
            QuestionResult r = new QuestionResult();
            r.questionId = questionId;
            r.correct = correct;
            r.correctAnswer = correctAnswer;
            r.explanation = explanation;
            return r;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public boolean isCorrect() {
            return correct;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public String getExplanation() {
            return explanation;
        }
    }
}
