package com.studyapp.backend.controller;

import com.studyapp.backend.dto.CalendarEventDTO;
import com.studyapp.backend.dto.CreateCalendarEventRequest;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.CalendarEventService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    public CalendarEventController(CalendarEventService calendarEventService) {
        this.calendarEventService = calendarEventService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEventDTO>> list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return ResponseEntity.ok(calendarEventService.listForUser(CurrentUser.id(), from, to));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEventDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(calendarEventService.getOne(CurrentUser.id(), id));
    }

    @PostMapping
    public ResponseEntity<CalendarEventDTO> create(@Valid @RequestBody CreateCalendarEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(calendarEventService.create(CurrentUser.id(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEventDTO> update(@PathVariable Long id, @Valid @RequestBody CreateCalendarEventRequest request) {
        return ResponseEntity.ok(calendarEventService.update(CurrentUser.id(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        calendarEventService.delete(CurrentUser.id(), id);
        return ResponseEntity.noContent().build();
    }
}
