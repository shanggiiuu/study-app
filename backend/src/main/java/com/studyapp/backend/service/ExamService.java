package com.studyapp.backend.service;

import com.studyapp.backend.dto.CreateExamRequest;
import com.studyapp.backend.dto.ExamDTO;
import com.studyapp.backend.entity.Exam;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.ExamRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public ExamService(ExamRepository examRepository, SubjectRepository subjectRepository,
                        UserRepository userRepository) {
        this.examRepository = examRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<ExamDTO> listForUser(Long userId) {
        return examRepository.findByUserIdOrderByExamDateAsc(userId).stream()
                .map(ExamDTO::from)
                .toList();
    }

    public ExamDTO getOne(Long userId, Long examId) {
        return ExamDTO.from(findOwned(userId, examId));
    }

    @Transactional
    public ExamDTO create(Long userId, CreateExamRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Exam exam = new Exam();
        exam.setUser(user);
        applyRequest(userId, exam, request);

        return ExamDTO.from(examRepository.save(exam));
    }

    @Transactional
    public ExamDTO update(Long userId, Long examId, CreateExamRequest request) {
        Exam exam = findOwned(userId, examId);
        applyRequest(userId, exam, request);
        return ExamDTO.from(examRepository.save(exam));
    }

    @Transactional
    public void delete(Long userId, Long examId) {
        Exam exam = findOwned(userId, examId);
        examRepository.delete(exam);
    }

    private Exam findOwned(Long userId, Long examId) {
        return examRepository.findByIdAndUserId(examId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
    }

    private void applyRequest(Long userId, Exam exam, CreateExamRequest request) {
        exam.setTitle(request.getTitle());
        exam.setExamDate(request.getExamDate());
        exam.setScore(request.getScore());
        exam.setMaxScore(request.getMaxScore());
        exam.setLocation(request.getLocation());

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            exam.setSubject(subject);
        } else {
            exam.setSubject(null);
        }
    }
}
