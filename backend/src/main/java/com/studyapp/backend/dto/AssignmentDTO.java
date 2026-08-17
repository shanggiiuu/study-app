package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Assignment;

import java.time.Instant;
import java.time.LocalDate;

public class AssignmentDTO {
    private Long id;
    private String title;
    private LocalDate dueDate;
    private String status;
    private String priority;
    private String notes;
    private Long subjectId;
    private String subjectName;
    private Instant createdAt;

    public static AssignmentDTO from(Assignment assignment) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.id = assignment.getId();
        dto.title = assignment.getTitle();
        dto.dueDate = assignment.getDueDate();
        dto.status = assignment.getStatus();
        dto.priority = assignment.getPriority();
        dto.notes = assignment.getNotes();
        if (assignment.getSubject() != null) {
            dto.subjectId = assignment.getSubject().getId();
            dto.subjectName = assignment.getSubject().getName();
        }
        dto.createdAt = assignment.getCreatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public String getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public String getNotes() {
        return notes;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
