package com.universitysearch.backend.controller;

import com.universitysearch.backend.dto.UniversityDTO;
import com.universitysearch.backend.service.UniversityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @GetMapping
    public ResponseEntity<List<UniversityDTO>> getAll() {
        return ResponseEntity.ok(universityService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(universityService.getById(id));
    }

    @PostMapping
    public ResponseEntity<UniversityDTO> create(@Valid @RequestBody UniversityDTO dto) {
        UniversityDTO created = universityService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversityDTO> update(@PathVariable Long id, @Valid @RequestBody UniversityDTO dto) {
        return ResponseEntity.ok(universityService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        universityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UniversityDTO>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String program
    ) {
        return ResponseEntity.ok(universityService.search(name, country, city, program));
    }
}
