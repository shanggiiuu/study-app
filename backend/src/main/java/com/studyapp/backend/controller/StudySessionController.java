package com.studyapp.backend.controller;

import com.studyapp.backend.dto.StartStudySessionRequest;
import com.studyapp.backend.dto.StudySessionDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.StudySessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
public class StudySessionController {

    private final StudySessionService studySessionService;

    public StudySessionController(StudySessionService studySessionService) {
        this.studySessionService = studySessionService;
    }

    @GetMapping
    public ResponseEntity<List<StudySessionDTO>> list() {
        return ResponseEntity.ok(studySessionService.listForUser(CurrentUser.id()));
    }

    @PostMapping("/start")
    public ResponseEntity<StudySessionDTO> start(@RequestBody(required = false) StartStudySessionRequest request) {
        StartStudySessionRequest body = request != null ? request : new StartStudySessionRequest();
        return ResponseEntity.status(HttpStatus.CREATED).body(studySessionService.start(CurrentUser.id(), body));
    }

    @PostMapping("/{id}/stop")
    public ResponseEntity<StudySessionDTO> stop(@PathVariable Long id) {
        return ResponseEntity.ok(studySessionService.stop(CurrentUser.id(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studySessionService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
