package com.studyapp.backend.controller;

import com.studyapp.backend.dto.ChangePasswordRequest;
import com.studyapp.backend.dto.UpdateProfileRequest;
import com.studyapp.backend.dto.UpdateSettingsRequest;
import com.studyapp.backend.dto.UserDTO;
import com.studyapp.backend.security.CurrentUser;
import com.studyapp.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me() {
        return ResponseEntity.ok(userService.getById(CurrentUser.id()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(CurrentUser.id(), request));
    }

    @PutMapping("/me/settings")
    public ResponseEntity<UserDTO> updateSettings(@Valid @RequestBody UpdateSettingsRequest request) {
        return ResponseEntity.ok(userService.updateSettings(CurrentUser.id(), request));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(CurrentUser.id(), request);
        return ResponseEntity.noContent().build();
    }
}
