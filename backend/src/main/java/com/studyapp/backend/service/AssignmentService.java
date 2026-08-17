package com.studyapp.backend.service;

import com.studyapp.backend.dto.AssignmentDTO;
import com.studyapp.backend.dto.CreateAssignmentRequest;
import com.studyapp.backend.entity.Assignment;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.AssignmentRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class AssignmentService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("PENDING", "SUBMITTED", "GRADED");
    private static final Set<String> ALLOWED_PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH");

    private final AssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, SubjectRepository subjectRepository,
                              UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    public List<AssignmentDTO> listForUser(Long userId) {
        return assignmentRepository.findByUserIdOrderByDueDateAsc(userId).stream()
                .map(AssignmentDTO::from)
                .toList();
    }

    public AssignmentDTO getOne(Long userId, Long assignmentId) {
        return AssignmentDTO.from(findOwned(userId, assignmentId));
    }

    @Transactional
    public AssignmentDTO create(Long userId, CreateAssignmentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Assignment assignment = new Assignment();
        assignment.setUser(user);
        applyRequest(userId, assignment, request);

        return AssignmentDTO.from(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentDTO update(Long userId, Long assignmentId, CreateAssignmentRequest request) {
        Assignment assignment = findOwned(userId, assignmentId);
        applyRequest(userId, assignment, request);
        return AssignmentDTO.from(assignmentRepository.save(assignment));
    }

    @Transactional
    public void delete(Long userId, Long assignmentId) {
        Assignment assignment = findOwned(userId, assignmentId);
        assignmentRepository.delete(assignment);
    }

    private Assignment findOwned(Long userId, Long assignmentId) {
        return assignmentRepository.findByIdAndUserId(assignmentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
    }

    private void applyRequest(Long userId, Assignment assignment, CreateAssignmentRequest request) {
        assignment.setTitle(request.getTitle());
        assignment.setDueDate(request.getDueDate());

        String status = request.getStatus() == null ? "PENDING" : request.getStatus().toUpperCase();
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + request.getStatus());
        }
        assignment.setStatus(status);

        String priority = request.getPriority() == null ? "MEDIUM" : request.getPriority().toUpperCase();
        if (!ALLOWED_PRIORITIES.contains(priority)) {
            throw new IllegalArgumentException("Invalid priority: " + request.getPriority());
        }
        assignment.setPriority(priority);

        assignment.setNotes(request.getNotes());

        if (request.getSubjectId() != null) {
            Subject subject = subjectRepository.findByIdAndUserId(request.getSubjectId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            assignment.setSubject(subject);
        } else {
            assignment.setSubject(null);
        }
    }
}
