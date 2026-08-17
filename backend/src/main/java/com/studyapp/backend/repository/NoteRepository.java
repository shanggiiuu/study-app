package com.studyapp.backend.repository;

import com.studyapp.backend.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<Note> findByIdAndUserId(Long id, Long userId);
}
