package com.studyapp.backend.service;

import com.studyapp.backend.entity.Document;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.DocumentRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public DocumentService(DocumentRepository documentRepository, SubjectRepository subjectRepository,
                            UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public java.util.List<Document> listForUser(Long userId) {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Document findOwned(Long userId, Long id) {
        return documentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    @Transactional
    public Document upload(Long userId, String title, Long subjectId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Document document = new Document();
        document.setUser(user);
        document.setTitle(title != null && !title.isBlank() ? title : file.getOriginalFilename());
        document.setOriginalFilename(file.getOriginalFilename());
        document.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        document.setByteSize(file.getSize());
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read uploaded file", e);
        }
        document.setContent(bytes);
        document.setExtractedText(extractText(document.getContentType(), bytes));

        if (subjectId != null) {
            Subject subject = subjectRepository.findByIdAndUserId(subjectId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            document.setSubject(subject);
        }

        return documentRepository.save(document);
    }

    @Transactional
    public void delete(Long userId, Long id) {
        documentRepository.delete(findOwned(userId, id));
    }

    private String extractText(String contentType, byte[] bytes) {
        try {
            if ("application/pdf".equals(contentType)) {
                try (PDDocument pdf = Loader.loadPDF(bytes)) {
                    return new PDFTextStripper().getText(pdf);
                }
            }
            if (contentType != null && contentType.startsWith("text/")) {
                return new String(bytes, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.warn("Failed to extract text from uploaded document (contentType={}): {}", contentType, e.getMessage());
        }
        return null;
    }
}
