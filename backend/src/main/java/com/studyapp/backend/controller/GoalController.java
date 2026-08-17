package com.studyapp.backend.controller;

import com.studyapp.backend.dto.CreateGoalRequest;
import com.studyapp.backend.dto.GoalDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ResponseEntity<List<GoalDTO>> list() {
        return ResponseEntity.ok(goalService.listForUser(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getOne(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<GoalDTO> create(@Valid @RequestBody CreateGoalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(goalService.create(CurrentUser.id(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDTO> update(@PathVariable Long id, @Valid @RequestBody CreateGoalRequest request) {
        return ResponseEntity.ok(goalService.update(CurrentUser.id(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        goalService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<GoalDTO> complete(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.complete(CurrentUser.id(), id));
    }
}
