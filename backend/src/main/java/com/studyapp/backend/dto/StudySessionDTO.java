package com.studyapp.backend.dto;

import com.studyapp.backend.entity.StudySession;

import java.time.Instant;

public class StudySessionDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private Instant startTime;
    private Instant endTime;
    private Integer durationMinutes;
    private boolean inProgress;

    public static StudySessionDTO from(StudySession session) {
        StudySessionDTO dto = new StudySessionDTO();
        dto.id = session.getId();
        if (session.getSubject() != null) {
            dto.subjectId = session.getSubject().getId();
            dto.subjectName = session.getSubject().getName();
        }
        dto.startTime = session.getStartTime();
        dto.endTime = session.getEndTime();
        dto.durationMinutes = session.getDurationMinutes();
        dto.inProgress = session.getEndTime() == null;
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

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public boolean isInProgress() {
        return inProgress;
    }
}
