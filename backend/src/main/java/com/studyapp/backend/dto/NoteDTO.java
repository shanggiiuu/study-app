package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Note;

import java.time.Instant;

public class NoteDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String title;
    private String body;
    private Instant createdAt;
    private Instant updatedAt;

    public static NoteDTO from(Note note) {
        NoteDTO dto = new NoteDTO();
        dto.id = note.getId();
        if (note.getSubject() != null) {
            dto.subjectId = note.getSubject().getId();
            dto.subjectName = note.getSubject().getName();
        }
        dto.title = note.getTitle();
        dto.body = note.getBody();
        dto.createdAt = note.getCreatedAt();
        dto.updatedAt = note.getUpdatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
