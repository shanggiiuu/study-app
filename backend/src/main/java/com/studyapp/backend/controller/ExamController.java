package com.studyapp.backend.controller;

import com.studyapp.backend.dto.CreateExamRequest;
import com.studyapp.backend.dto.ExamDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<List<ExamDTO>> list() {
        return ResponseEntity.ok(examService.listForUser(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getOne(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<ExamDTO> create(@Valid @RequestBody CreateExamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examService.create(CurrentUser.id(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamDTO> update(@PathVariable Long id, @Valid @RequestBody CreateExamRequest request) {
        return ResponseEntity.ok(examService.update(CurrentUser.id(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
