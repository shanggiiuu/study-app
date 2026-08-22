package com.studyapp.backend.service;

import com.studyapp.backend.dto.AdviceResponse;
import com.studyapp.backend.entity.Assignment;
import com.studyapp.backend.entity.Exam;
import com.studyapp.backend.entity.GradeEntry;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.repository.AssignmentRepository;
import com.studyapp.backend.repository.ExamRepository;
import com.studyapp.backend.repository.GoalRepository;
import com.studyapp.backend.repository.GradeEntryRepository;
import com.studyapp.backend.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdviceService {
    private final SubjectRepository subjects;
    private final GradeEntryRepository gradeEntries;
    private final AssignmentRepository assignments;
    private final ExamRepository exams;
    private final GoalRepository goals;
    private final GroqClient groqClient;

    public AdviceService(SubjectRepository subjects, GradeEntryRepository gradeEntries, AssignmentRepository assignments,
                          ExamRepository exams, GoalRepository goals, GroqClient groqClient) {
        this.subjects = subjects;
        this.gradeEntries = gradeEntries;
        this.assignments = assignments;
        this.exams = exams;
        this.goals = goals;
        this.groqClient = groqClient;
    }

    public AdviceResponse summary(Long userId) { return ask(userId, "Give exactly three short, practical study recommendations based on this student's current data. Use bullets and no preamble."); }
    public AdviceResponse chat(Long userId, String question) { return ask(userId, question); }

    private AdviceResponse ask(Long userId, String question) {
        String systemPrompt = "You are StudyDesk's encouraging academic coach. Use only the supplied student data. Be concise, practical, and do not invent grades, deadlines, or facts.";
        String userPrompt = "Student data:\n" + context(userId) + "\n\nQuestion: " + question;
        return new AdviceResponse(groqClient.complete(systemPrompt, userPrompt, 500));
    }

    private double currentPercent(Subject subject) {
        List<GradeEntry> grades = gradeEntries.findBySubjectIdOrderByDateDesc(subject.getId());
        double totalWeighted = 0;
        double totalPossible = 0;
        for (GradeEntry g : grades) {
            totalWeighted += g.getScore() * g.getWeight();
            totalPossible += g.getMaxScore() * g.getWeight();
        }
        return totalPossible > 0 ? (totalWeighted / totalPossible) * 100 : 0;
    }

    private String context(Long userId) {
        List<Subject> subjectList = subjects.findByUserIdOrderByNameAsc(userId);
        List<Assignment> pending = assignments.findByUserIdOrderByDueDateAsc(userId).stream().filter(a -> "PENDING".equals(a.getStatus())).limit(8).toList();
        List<Exam> upcoming = exams.findByUserIdOrderByExamDateAsc(userId).stream().filter(e -> !e.getExamDate().isBefore(LocalDate.now())).limit(6).toList();
        String subjectText = subjectList.stream().map(s -> s.getName() + ": " + String.format("%.1f", currentPercent(s)) + "%").reduce((a, b) -> a + ", " + b).orElse("No subjects or grades recorded");
        String assignmentText = pending.stream().map(a -> a.getTitle() + " due " + a.getDueDate() + " (" + a.getPriority() + ")").reduce((a, b) -> a + "; " + b).orElse("No pending assignments");
        String examText = upcoming.stream().map(e -> e.getTitle() + " on " + e.getExamDate()).reduce((a, b) -> a + "; " + b).orElse("No upcoming exams");
        return "Subjects and current percentages: " + subjectText + "\nPending assignments: " + assignmentText + "\nUpcoming exams: " + examText + "\nGoal count: " + goals.findByUserIdOrderByCreatedAtDesc(userId).size();
    }
}
