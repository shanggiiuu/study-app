package com.studyapp.backend.controller;

import com.studyapp.backend.dto.DocumentDTO;
import com.studyapp.backend.entity.Document;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.DocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> list() {
        List<DocumentDTO> docs = documentService.listForUser(CurrentUser.id()).stream()
                .map(DocumentDTO::from)
                .toList();
        return ResponseEntity.ok(docs);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDTO> upload(@RequestParam("file") MultipartFile file,
                                               @RequestParam(value = "title", required = false) String title,
                                               @RequestParam(value = "subjectId", required = false) Long subjectId) {
        Document document = documentService.upload(CurrentUser.id(), title, subjectId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(DocumentDTO.from(document));
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Document document = documentService.findOwned(CurrentUser.id(), id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getOriginalFilename() + "\"")
                .body(document.getContent());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
