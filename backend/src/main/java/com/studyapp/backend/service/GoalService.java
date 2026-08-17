package com.studyapp.backend.service;

import com.studyapp.backend.dto.CreateGoalRequest;
import com.studyapp.backend.dto.GoalDTO;
import com.studyapp.backend.entity.Goal;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.GoalRepository;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class GoalService {

    private static final Set<String> ALLOWED_STATUSES = Set.of("ACTIVE", "COMPLETED");

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public List<GoalDTO> listForUser(Long userId) {
        return goalRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(GoalDTO::from)
                .toList();
    }

    public GoalDTO getOne(Long userId, Long goalId) {
        return GoalDTO.from(findOwned(userId, goalId));
    }

    @Transactional
    public GoalDTO create(Long userId, CreateGoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Goal goal = new Goal();
        goal.setUser(user);
        applyRequest(goal, request);

        return GoalDTO.from(goalRepository.save(goal));
    }

    @Transactional
    public GoalDTO update(Long userId, Long goalId, CreateGoalRequest request) {
        Goal goal = findOwned(userId, goalId);
        applyRequest(goal, request);
        return GoalDTO.from(goalRepository.save(goal));
    }

    @Transactional
    public void delete(Long userId, Long goalId) {
        Goal goal = findOwned(userId, goalId);
        goalRepository.delete(goal);
    }

    @Transactional
    public GoalDTO complete(Long userId, Long goalId) {
        Goal goal = findOwned(userId, goalId);
        goal.setStatus("COMPLETED");
        goal.setProgressPercent(100);
        return GoalDTO.from(goalRepository.save(goal));
    }

    private Goal findOwned(Long userId, Long goalId) {
        return goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
    }

    private void applyRequest(Goal goal, CreateGoalRequest request) {
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        goal.setTargetDate(request.getTargetDate());
        goal.setProgressPercent(request.getProgressPercent() == null ? 0 : request.getProgressPercent());

        String status = request.getStatus() == null ? "ACTIVE" : request.getStatus().toUpperCase();
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + request.getStatus());
        }
        goal.setStatus(status);
    }
}
