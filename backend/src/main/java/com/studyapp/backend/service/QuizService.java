package com.studyapp.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyapp.backend.dto.QuizAttemptResult;
import com.studyapp.backend.dto.QuizDTO;
import com.studyapp.backend.dto.QuizDetailDTO;
import com.studyapp.backend.dto.QuizQuestionDTO;
import com.studyapp.backend.entity.Document;
import com.studyapp.backend.entity.Quiz;
import com.studyapp.backend.entity.QuizQuestion;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.QuizQuestionRepository;
import com.studyapp.backend.repository.QuizRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public QuizService(QuizRepository quizRepository, QuizQuestionRepository questionRepository,
                        SubjectRepository subjectRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<QuizDTO> listForUser(Long userId) {
        return quizRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(quiz -> QuizDTO.from(quiz, questionRepository.countByQuizId(quiz.getId())))
                .toList();
    }

    public QuizDetailDTO getOne(Long userId, Long id) {
        Quiz quiz = findOwned(userId, id);
        List<QuizQuestion> questions = questionRepository.findByQuizIdOrderByCreatedAtAsc(id);
        List<QuizQuestionDTO> questionDTOs = questions.stream()
                .map(q -> QuizQuestionDTO.from(q, parseOptions(q.getOptionsJson())))
                .toList();
        return QuizDetailDTO.of(QuizDTO.from(quiz, questions.size()), questionDTOs);
    }

    @Transactional
    public void delete(Long userId, Long id) {
        quizRepository.delete(findOwned(userId, id));
    }

    @Transactional
    public QuizDetailDTO createFromGenerated(Long userId, String title, Long subjectId, Document document,
                                              List<AiGenerationService.GeneratedQuestion> generated) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Quiz quiz = new Quiz();
        quiz.setUser(user);
        quiz.setTitle(title);
        quiz.setDocument(document);
        if (subjectId != null) {
            Subject subject = subjectRepository.findByIdAndUserId(subjectId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            quiz.setSubject(subject);
        }
        quiz = quizRepository.save(quiz);

        for (AiGenerationService.GeneratedQuestion gq : generated) {
            QuizQuestion question = new QuizQuestion();
            question.setQuiz(quiz);
            question.setType(gq.type());
            question.setQuestion(gq.question());
            question.setCorrectAnswer(gq.correctAnswer());
            question.setExplanation(gq.explanation());
            question.setOptionsJson(writeOptions(gq.options()));
            questionRepository.save(question);
        }

        return getOne(userId, quiz.getId());
    }

    public QuizAttemptResult submitAttempt(Long userId, Long quizId, Map<Long, String> answers) {
        findOwned(userId, quizId);
        List<QuizQuestion> questions = questionRepository.findByQuizIdOrderByCreatedAtAsc(quizId);
        int score = 0;
        List<QuizAttemptResult.QuestionResult> results = new ArrayList<>();
        for (QuizQuestion q : questions) {
            String given = answers == null ? null : answers.get(q.getId());
            boolean correct = given != null && given.trim().equalsIgnoreCase(q.getCorrectAnswer().trim());
            if (correct) score++;
            results.add(QuizAttemptResult.QuestionResult.of(q.getId(), correct, q.getCorrectAnswer(), q.getExplanation()));
        }
        return QuizAttemptResult.of(score, questions.size(), results);
    }

    private Quiz findOwned(Long userId, Long id) {
        return quizRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
    }

    private List<String> parseOptions(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return mapper.readValue(json, mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            return List.of();
        }
    }

    private String writeOptions(List<String> options) {
        try {
            return mapper.writeValueAsString(options == null ? List.of() : options);
        } catch (Exception e) {
            return "[]";
        }
    }
}
