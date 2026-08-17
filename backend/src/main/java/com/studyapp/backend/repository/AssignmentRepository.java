package com.studyapp.backend.repository;

import com.studyapp.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByUserIdOrderByDueDateAsc(Long userId);

    Optional<Assignment> findByIdAndUserId(Long id, Long userId);
}
