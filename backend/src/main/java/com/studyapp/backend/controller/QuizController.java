package com.studyapp.backend.controller;

import com.studyapp.backend.dto.QuizAttemptRequest;
import com.studyapp.backend.dto.QuizAttemptResult;
import com.studyapp.backend.dto.QuizDTO;
import com.studyapp.backend.dto.QuizDetailDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> list() {
        return ResponseEntity.ok(quizService.listForUser(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDetailDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getOne(CurrentUser.id(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quizService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/attempts")
    public ResponseEntity<QuizAttemptResult> submitAttempt(@PathVariable Long id, @Valid @RequestBody QuizAttemptRequest request) {
        return ResponseEntity.ok(quizService.submitAttempt(CurrentUser.id(), id, request.getAnswers()));
    }
}
