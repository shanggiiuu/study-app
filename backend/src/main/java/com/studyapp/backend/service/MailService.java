package com.studyapp.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reset your StudyDesk password");
        message.setText(
                "We received a request to reset your StudyDesk password.\n\n" +
                        "Click the link below to choose a new password. This link expires in 1 hour:\n" +
                        resetLink + "\n\n" +
                        "If you didn't request this, you can safely ignore this email.");
        try {
            mailSender.send(message);
        } catch (MailException ex) {
            // Sending failure shouldn't reveal account existence or break the request/response cycle.
            log.error("Failed to send password reset email", ex);
        }
    }
}
