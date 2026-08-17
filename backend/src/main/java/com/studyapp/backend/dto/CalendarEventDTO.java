package com.studyapp.backend.dto;

import com.studyapp.backend.entity.CalendarEvent;

import java.time.Instant;

public class CalendarEventDTO {
    private Long id;
    private String title;
    private String type;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private Long subjectId;
    private String subjectName;

    public static CalendarEventDTO from(CalendarEvent event) {
        CalendarEventDTO dto = new CalendarEventDTO();
        dto.id = event.getId();
        dto.title = event.getTitle();
        dto.type = event.getType();
        dto.startTime = event.getStartTime();
        dto.endTime = event.getEndTime();
        dto.location = event.getLocation();
        if (event.getSubject() != null) {
            dto.subjectId = event.getSubject().getId();
            dto.subjectName = event.getSubject().getName();
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
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
}
