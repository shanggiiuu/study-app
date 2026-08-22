package com.studyapp.backend.controller;

import com.studyapp.backend.dto.*;
import com.studyapp.backend.entity.Document;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.AiGenerationService;
import com.studyapp.backend.service.DocumentService;
import com.studyapp.backend.service.FlashcardService;
import com.studyapp.backend.service.NoteService;
import com.studyapp.backend.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final AiGenerationService aiGenerationService;
    private final FlashcardService flashcardService;
    private final NoteService noteService;
    private final QuizService quizService;

    public DocumentController(DocumentService documentService, AiGenerationService aiGenerationService,
                               FlashcardService flashcardService, NoteService noteService, QuizService quizService) {
        this.documentService = documentService;
        this.aiGenerationService = aiGenerationService;
        this.flashcardService = flashcardService;
        this.noteService = noteService;
        this.quizService = quizService;
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

    @PostMapping("/{id}/generate-flashcards")
    public ResponseEntity<FlashcardDeckDTO> generateFlashcards(@PathVariable Long id, @RequestBody(required = false) GenerateFlashcardsRequest request) {
        Long userId = CurrentUser.id();
        Document document = documentService.findOwned(userId, id);
        String text = requireExtractedText(document);
        int count = request != null && request.getCount() > 0 ? request.getCount() : 12;

        List<AiGenerationService.GeneratedCard> cards = aiGenerationService.generateFlashcards(text, count);
        List<String[]> pairs = cards.stream().map(c -> new String[]{c.front(), c.back()}).toList();
        Long subjectId = document.getSubject() != null ? document.getSubject().getId() : null;

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(flashcardService.createDeckWithCards(userId, document.getTitle(), subjectId, pairs));
    }

    @PostMapping("/{id}/generate-notes")
    public ResponseEntity<NoteDTO> generateNotes(@PathVariable Long id) {
        Long userId = CurrentUser.id();
        Document document = documentService.findOwned(userId, id);
        String text = requireExtractedText(document);

        String notes = aiGenerationService.generateNotes(text);
        CreateNoteRequest request = new CreateNoteRequest();
        request.setTitle(document.getTitle());
        request.setBody(notes);
        if (document.getSubject() != null) {
            request.setSubjectId(document.getSubject().getId());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(userId, request));
    }

    @PostMapping("/{id}/generate-quiz")
    public ResponseEntity<QuizDetailDTO> generateQuiz(@PathVariable Long id, @RequestBody(required = false) GenerateQuizRequest request) {
        Long userId = CurrentUser.id();
        Document document = documentService.findOwned(userId, id);
        String text = requireExtractedText(document);
        int count = request != null && request.getCount() > 0 ? request.getCount() : 8;
        String type = request != null && request.getType() != null ? request.getType() : "MIXED";

        List<AiGenerationService.GeneratedQuestion> questions = aiGenerationService.generateQuiz(text, count, type);
        Long subjectId = document.getSubject() != null ? document.getSubject().getId() : null;

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(quizService.createFromGenerated(userId, document.getTitle(), subjectId, document, questions));
    }

    @PostMapping("/{id}/chat")
    public ResponseEntity<AdviceResponse> chat(@PathVariable Long id, @Valid @RequestBody AdviceRequest request) {
        Document document = documentService.findOwned(CurrentUser.id(), id);
        String text = requireExtractedText(document);
        return ResponseEntity.ok(new AdviceResponse(aiGenerationService.chatAboutDocument(text, request.getQuestion())));
    }

    private String requireExtractedText(Document document) {
        String text = document.getExtractedText();
        if (text == null || text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No extractable text for this document. Only PDF and plain text files are supported.");
        }
        return text;
    }
}
