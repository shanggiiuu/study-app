package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Document;

import java.time.Instant;

public class DocumentDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String title;
    private String originalFilename;
    private String contentType;
    private long byteSize;
    private Instant createdAt;
    private boolean textExtracted;

    public static DocumentDTO from(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.id = document.getId();
        if (document.getSubject() != null) {
            dto.subjectId = document.getSubject().getId();
            dto.subjectName = document.getSubject().getName();
        }
        dto.title = document.getTitle();
        dto.originalFilename = document.getOriginalFilename();
        dto.contentType = document.getContentType();
        dto.byteSize = document.getByteSize();
        dto.createdAt = document.getCreatedAt();
        dto.textExtracted = document.getExtractedText() != null && !document.getExtractedText().isBlank();
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

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public long getByteSize() {
        return byteSize;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public boolean isTextExtracted() {
        return textExtracted;
    }
}
