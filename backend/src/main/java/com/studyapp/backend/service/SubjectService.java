package com.studyapp.backend.service;

import com.studyapp.backend.dto.CreateGradeEntryRequest;
import com.studyapp.backend.dto.CreateSubjectRequest;
import com.studyapp.backend.dto.GradeEntryDTO;
import com.studyapp.backend.dto.SubjectDTO;
import com.studyapp.backend.entity.GradeEntry;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.GradeEntryRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final GradeEntryRepository gradeEntryRepository;
    private final UserRepository userRepository;

    public SubjectService(SubjectRepository subjectRepository, GradeEntryRepository gradeEntryRepository,
                           UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.gradeEntryRepository = gradeEntryRepository;
        this.userRepository = userRepository;
    }

    public List<SubjectDTO> listForUser(Long userId) {
        return subjectRepository.findByUserIdOrderByNameAsc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public SubjectDTO getOne(Long userId, Long subjectId) {
        return toDto(findOwned(userId, subjectId));
    }

    @Transactional
    public SubjectDTO create(Long userId, CreateSubjectRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Subject subject = new Subject();
        subject.setUser(user);
        applyRequest(subject, request);

        return toDto(subjectRepository.save(subject));
    }

    @Transactional
    public SubjectDTO update(Long userId, Long subjectId, CreateSubjectRequest request) {
        Subject subject = findOwned(userId, subjectId);
        applyRequest(subject, request);
        return toDto(subjectRepository.save(subject));
    }

    @Transactional
    public void delete(Long userId, Long subjectId) {
        Subject subject = findOwned(userId, subjectId);
        subjectRepository.delete(subject);
    }

    @Transactional
    public GradeEntryDTO addGrade(Long userId, Long subjectId, CreateGradeEntryRequest request) {
        Subject subject = findOwned(userId, subjectId);

        GradeEntry entry = new GradeEntry();
        entry.setSubject(subject);
        applyGradeRequest(entry, request);

        return GradeEntryDTO.from(gradeEntryRepository.save(entry));
    }

    @Transactional
    public GradeEntryDTO updateGrade(Long userId, Long subjectId, Long gradeId, CreateGradeEntryRequest request) {
        findOwned(userId, subjectId);
        GradeEntry entry = gradeEntryRepository.findByIdAndSubjectId(gradeId, subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade entry not found"));

        applyGradeRequest(entry, request);
        return GradeEntryDTO.from(gradeEntryRepository.save(entry));
    }

    @Transactional
    public void deleteGrade(Long userId, Long subjectId, Long gradeId) {
        findOwned(userId, subjectId);
        GradeEntry entry = gradeEntryRepository.findByIdAndSubjectId(gradeId, subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade entry not found"));
        gradeEntryRepository.delete(entry);
    }

    Subject findOwned(Long userId, Long subjectId) {
        return subjectRepository.findByIdAndUserId(subjectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
    }

    private void applyRequest(Subject subject, CreateSubjectRequest request) {
        subject.setName(request.getName());
        subject.setIconKey(request.getIconKey());
        subject.setColorKey(request.getColorKey());
        subject.setCredits(request.getCredits());
    }

    private void applyGradeRequest(GradeEntry entry, CreateGradeEntryRequest request) {
        entry.setLabel(request.getLabel());
        entry.setScore(request.getScore());
        entry.setMaxScore(request.getMaxScore());
        entry.setWeight(request.getWeight() == null ? 1.0 : request.getWeight());
        entry.setCategory(request.getCategory());
        entry.setDate(request.getDate());
    }

    private SubjectDTO toDto(Subject subject) {
        List<GradeEntryDTO> grades = gradeEntryRepository.findBySubjectIdOrderByDateDesc(subject.getId()).stream()
                .map(GradeEntryDTO::from)
                .toList();
        return SubjectDTO.from(subject, grades);
    }
}
