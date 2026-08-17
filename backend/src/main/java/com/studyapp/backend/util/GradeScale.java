package com.studyapp.backend.util;

public final class GradeScale {

    private GradeScale() {
    }

    public static String letterFor(double percent) {
        if (percent >= 97) return "A+";
        if (percent >= 93) return "A";
        if (percent >= 90) return "A-";
        if (percent >= 87) return "B+";
        if (percent >= 83) return "B";
        if (percent >= 80) return "B-";
        if (percent >= 77) return "C+";
        if (percent >= 73) return "C";
        if (percent >= 70) return "C-";
        if (percent >= 67) return "D+";
        if (percent >= 63) return "D";
        if (percent >= 60) return "D-";
        return "F";
    }

    public static double gpaPointsFor(double percent) {
        return switch (letterFor(percent)) {
            case "A+", "A" -> 4.0;
            case "A-" -> 3.7;
            case "B+" -> 3.3;
            case "B" -> 3.0;
            case "B-" -> 2.7;
            case "C+" -> 2.3;
            case "C" -> 2.0;
            case "C-" -> 1.7;
            case "D+" -> 1.3;
            case "D" -> 1.0;
            case "D-" -> 0.7;
            default -> 0.0;
        };
    }
}
