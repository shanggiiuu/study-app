package com.studyapp.backend.repository;

import com.studyapp.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByUserIdOrderByNameAsc(Long userId);

    Optional<Subject> findByIdAndUserId(Long id, Long userId);
}
