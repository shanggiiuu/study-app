package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Exam;

import java.time.Instant;
import java.time.LocalDate;

public class ExamDTO {
    private Long id;
    private String title;
    private LocalDate examDate;
    private Double score;
    private Double maxScore;
    private String location;
    private Long subjectId;
    private String subjectName;
    private Instant createdAt;

    public static ExamDTO from(Exam exam) {
        ExamDTO dto = new ExamDTO();
        dto.id = exam.getId();
        dto.title = exam.getTitle();
        dto.examDate = exam.getExamDate();
        dto.score = exam.getScore();
        dto.maxScore = exam.getMaxScore();
        dto.location = exam.getLocation();
        if (exam.getSubject() != null) {
            dto.subjectId = exam.getSubject().getId();
            dto.subjectName = exam.getSubject().getName();
        }
        dto.createdAt = exam.getCreatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public Double getScore() {
        return score;
    }

    public Double getMaxScore() {
        return maxScore;
    }

    public String getLocation() {
        return location;
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
