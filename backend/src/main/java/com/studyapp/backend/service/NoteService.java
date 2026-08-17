package com.studyapp.backend.service;

import com.studyapp.backend.dto.CreateNoteRequest;
import com.studyapp.backend.dto.NoteDTO;
import com.studyapp.backend.entity.Note;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.NoteRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, SubjectRepository subjectRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<NoteDTO> listForUser(Long userId) {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .map(NoteDTO::from)
                .toList();
    }

    public NoteDTO getOne(Long userId, Long id) {
        return NoteDTO.from(findOwned(userId, id));
    }

    @Transactional
    public NoteDTO create(Long userId, CreateNoteRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Note note = new Note();
        note.setUser(user);
        applyRequest(userId, note, request);

        return NoteDTO.from(noteRepository.save(note));
    }

    @Transactional
    public NoteDTO update(Long userId, Long id, CreateNoteRequest request) {
        Note note = findOwned(userId, id);
        applyRequest(userId, note, request);
        note.setUpdatedAt(Instant.now());
        return NoteDTO.from(noteRepository.save(note));
    }

    @Transactional
    public void delete(Long userId, Long id) {
        noteRepository.delete(findOwned(userId, id));
    }

    private void applyRequest(Long userId, Note note, CreateNoteRequest request) {
        note.setTitle(request.getTitle());
        note.setBody(request.getBody());
        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            note.setSubject(subject);
        } else {
            note.setSubject(null);
        }
    }

    private Note findOwned(Long userId, Long id) {
        return noteRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
    }
}
