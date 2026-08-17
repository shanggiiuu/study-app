package com.studyapp.backend.controller;

import com.studyapp.backend.dto.CreateNoteRequest;
import com.studyapp.backend.dto.NoteDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<NoteDTO>> list() {
        return ResponseEntity.ok(noteService.listForUser(CurrentUser.id()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.getOne(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<NoteDTO> create(@Valid @RequestBody CreateNoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(CurrentUser.id(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDTO> update(@PathVariable Long id, @Valid @RequestBody CreateNoteRequest request) {
        return ResponseEntity.ok(noteService.update(CurrentUser.id(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noteService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
