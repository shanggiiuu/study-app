package com.studyapp.backend.service;

import com.studyapp.backend.dto.ChangePasswordRequest;
import com.studyapp.backend.dto.UpdateProfileRequest;
import com.studyapp.backend.dto.UpdateSettingsRequest;
import com.studyapp.backend.dto.UserDTO;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.EmailAlreadyInUseException;
import com.studyapp.backend.exception.InvalidCredentialsException;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getById(Long id) {
        return UserDTO.from(findUser(id));
    }

    @Transactional
    public UserDTO updateProfile(Long id, UpdateProfileRequest request) {
        User user = findUser(id);

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyInUseException("An account with this email already exists");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setSchool(request.getSchool());
        user.setGradeLevel(request.getGradeLevel());
        user.setGraduationYear(request.getGraduationYear());
        user.setProfilePictureUrl(request.getProfilePictureUrl());

        return UserDTO.from(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateSettings(Long id, UpdateSettingsRequest request) {
        User user = findUser(id);
        user.setWeeklyStudyGoalMinutes(request.getWeeklyStudyGoalMinutes());
        user.setTheme(request.getTheme());
        return UserDTO.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = findUser(id);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
