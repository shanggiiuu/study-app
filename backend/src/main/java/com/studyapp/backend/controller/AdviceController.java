package com.studyapp.backend.controller;

import com.studyapp.backend.dto.AdviceRequest;
import com.studyapp.backend.dto.AdviceResponse;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.AdviceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advice")
public class AdviceController {
    private final AdviceService adviceService;
    public AdviceController(AdviceService adviceService) { this.adviceService = adviceService; }
    @GetMapping("/summary") public ResponseEntity<AdviceResponse> summary() { return ResponseEntity.ok(adviceService.summary(CurrentUser.id())); }
    @PostMapping("/chat") public ResponseEntity<AdviceResponse> chat(@Valid @RequestBody AdviceRequest request) { return ResponseEntity.ok(adviceService.chat(CurrentUser.id(), request.getQuestion())); }
}
