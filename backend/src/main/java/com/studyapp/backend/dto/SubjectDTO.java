package com.studyapp.backend.dto;

import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.util.GradeScale;

import java.util.List;

public class SubjectDTO {
    private Long id;
    private String name;
    private String iconKey;
    private String colorKey;
    private Integer credits;
    private double currentPercent;
    private String letterGrade;
    private List<GradeEntryDTO> grades;

    public static SubjectDTO from(Subject subject, List<GradeEntryDTO> grades) {
        SubjectDTO dto = new SubjectDTO();
        dto.id = subject.getId();
        dto.name = subject.getName();
        dto.iconKey = subject.getIconKey();
        dto.colorKey = subject.getColorKey();
        dto.credits = subject.getCredits();
        dto.grades = grades;

        double totalWeighted = 0;
        double totalPossible = 0;
        for (GradeEntryDTO g : grades) {
            totalWeighted += g.getScore() * g.getWeight();
            totalPossible += g.getMaxScore() * g.getWeight();
        }
        dto.currentPercent = totalPossible > 0 ? (totalWeighted / totalPossible) * 100 : 0;
        dto.letterGrade = totalPossible > 0 ? GradeScale.letterFor(dto.currentPercent) : "—";
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIconKey() {
        return iconKey;
    }

    public String getColorKey() {
        return colorKey;
    }

    public Integer getCredits() {
        return credits;
    }

    public double getCurrentPercent() {
        return currentPercent;
    }

    public String getLetterGrade() {
        return letterGrade;
    }

    public List<GradeEntryDTO> getGrades() {
        return grades;
    }
}
