package com.studyapp.backend.service;

import com.studyapp.backend.dto.AuthResponse;
import com.studyapp.backend.dto.LoginRequest;
import com.studyapp.backend.dto.RegisterRequest;
import com.studyapp.backend.dto.UserDTO;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.EmailAlreadyInUseException;
import com.studyapp.backend.exception.InvalidCredentialsException;
import com.studyapp.backend.exception.InvalidResetTokenException;
import com.studyapp.backend.repository.UserRepository;
import com.studyapp.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;
    private final String frontendUrl;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            MailService mailService,
            @Value("${app.frontend-url}") String frontendUrl) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.frontendUrl = frontendUrl;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyInUseException("An account with this email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setSchool(request.getSchool());
        user.setGradeLevel(request.getGradeLevel());
        user.setGraduationYear(request.getGraduationYear());

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail());
        return new AuthResponse(token, UserDTO.from(saved));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, UserDTO.from(user));
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String rawToken = generateRawToken();
            user.setResetTokenHash(hashToken(rawToken));
            user.setResetTokenExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
            userRepository.save(user);

            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
            mailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });
        // Always return normally, whether or not the email matched an account,
        // so callers can't use this endpoint to discover registered emails.
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String tokenHash = hashToken(rawToken);
        User user = userRepository.findByResetTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidResetTokenException("This reset link is invalid or has expired"));

        if (user.getResetTokenExpiresAt() == null || user.getResetTokenExpiresAt().isBefore(Instant.now())) {
            throw new InvalidResetTokenException("This reset link is invalid or has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetTokenHash(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);
    }

    private static String generateRawToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
