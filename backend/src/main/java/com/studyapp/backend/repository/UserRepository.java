package com.studyapp.backend.repository;

import com.studyapp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByResetTokenHash(String resetTokenHash);

    boolean existsByEmail(String email);
}
