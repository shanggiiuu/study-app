package com.studyapp.backend.dto;

import com.studyapp.backend.entity.User;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String school;
    private String gradeLevel;
    private Integer graduationYear;
    private String profilePictureUrl;

    public static UserDTO from(User user) {
        UserDTO dto = new UserDTO();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.school = user.getSchool();
        dto.gradeLevel = user.getGradeLevel();
        dto.graduationYear = user.getGraduationYear();
        dto.profilePictureUrl = user.getProfilePictureUrl();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getSchool() {
        return school;
    }

    public String getGradeLevel() {
        return gradeLevel;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
}
