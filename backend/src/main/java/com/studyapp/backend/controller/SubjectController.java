package com.studyapp.backend.controller;

import com.studyapp.backend.dto.CreateGradeEntryRequest;
import com.studyapp.backend.dto.CreateSubjectRequest;
import com.studyapp.backend.dto.GradeEntryDTO;
import com.studyapp.backend.dto.SubjectDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectDTO>> list() {
        return ResponseEntity.ok(subjectService.listForUser(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getOne(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<SubjectDTO> create(@Valid @RequestBody CreateSubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.create(CurrentUser.id(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectDTO> update(@PathVariable Long id, @Valid @RequestBody CreateSubjectRequest request) {
        return ResponseEntity.ok(subjectService.update(CurrentUser.id(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/grades")
    public ResponseEntity<GradeEntryDTO> addGrade(@PathVariable Long id, @Valid @RequestBody CreateGradeEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.addGrade(CurrentUser.id(), id, request));
    }

    @PutMapping("/{id}/grades/{gradeId}")
    public ResponseEntity<GradeEntryDTO> updateGrade(@PathVariable Long id, @PathVariable Long gradeId,
                                                       @Valid @RequestBody CreateGradeEntryRequest request) {
        return ResponseEntity.ok(subjectService.updateGrade(CurrentUser.id(), id, gradeId, request));
    }

    @DeleteMapping("/{id}/grades/{gradeId}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id, @PathVariable Long gradeId) {
        subjectService.deleteGrade(CurrentUser.id(), id, gradeId);
        return ResponseEntity.noContent().build();
    }
}
