package com.studyapp.backend.controller;

import com.studyapp.backend.dto.AssignmentDTO;
import com.studyapp.backend.dto.CreateAssignmentRequest;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssignmentDTO>> list() {
        return ResponseEntity.ok(assignmentService.listForUser(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getOne(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<AssignmentDTO> create(@Valid @RequestBody CreateAssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assignmentService.create(CurrentUser.id(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentDTO> update(@PathVariable Long id, @Valid @RequestBody CreateAssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.update(CurrentUser.id(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
