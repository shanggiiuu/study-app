package com.studyapp.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyapp.backend.dto.AdviceResponse;
import com.studyapp.backend.entity.Assignment;
import com.studyapp.backend.entity.Exam;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.repository.AssignmentRepository;
import com.studyapp.backend.repository.ExamRepository;
import com.studyapp.backend.repository.GoalRepository;
import com.studyapp.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class AdviceService {
    private final SubjectRepository subjects;
    private final AssignmentRepository assignments;
    private final ExamRepository exams;
    private final GoalRepository goals;
    private final ObjectMapper mapper;
    private final HttpClient client = HttpClient.newHttpClient();
    @Value("${app.ai.groq.api-key:}") private String apiKey;
    @Value("${app.ai.groq.model:llama-3.3-70b-versatile}") private String model;

    public AdviceService(SubjectRepository subjects, AssignmentRepository assignments, ExamRepository exams, GoalRepository goals, ObjectMapper mapper) {
        this.subjects = subjects; this.assignments = assignments; this.exams = exams; this.goals = goals; this.mapper = mapper;
    }

    public AdviceResponse summary(Long userId) { return ask(userId, "Give exactly three short, practical study recommendations based on this student's current data. Use bullets and no preamble."); }
    public AdviceResponse chat(Long userId, String question) { return ask(userId, question); }

    private AdviceResponse ask(Long userId, String question) {
        if (apiKey == null || apiKey.isBlank()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI advice is not configured. Set GROQ_API_KEY on the backend.");
        try {
            Map<String, Object> body = Map.of("model", model, "temperature", 0.4, "max_tokens", 500, "messages", List.of(
                    Map.of("role", "system", "content", "You are StudyDesk's encouraging academic coach. Use only the supplied student data. Be concise, practical, and do not invent grades, deadlines, or facts."),
                    Map.of("role", "user", "content", "Student data:\n" + context(userId) + "\n\nQuestion: " + question)
            ));
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey).header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq could not generate advice. Check GROQ_API_KEY and GROQ_MODEL.");
            JsonNode content = mapper.readTree(response.body()).at("/choices/0/message/content");
            if (content.isMissingNode() || content.asText().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq returned an empty response.");
            return new AdviceResponse(content.asText().trim());
        } catch (ResponseStatusException ex) { throw ex;
        } catch (Exception ex) { throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to reach Groq AI service."); }
    }

    private String context(Long userId) {
        List<Subject> subjectList = subjects.findByUserIdOrderByNameAsc(userId);
        List<Assignment> pending = assignments.findByUserIdOrderByDueDateAsc(userId).stream().filter(a -> "PENDING".equals(a.getStatus())).limit(8).toList();
        List<Exam> upcoming = exams.findByUserIdOrderByExamDateAsc(userId).stream().filter(e -> !e.getExamDate().isBefore(LocalDate.now())).limit(6).toList();
        String subjectText = subjectList.stream().map(s -> s.getName() + ": " + String.format("%.1f", s.getCurrentPercent()) + "%").reduce((a, b) -> a + ", " + b).orElse("No subjects or grades recorded");
        String assignmentText = pending.stream().map(a -> a.getTitle() + " due " + a.getDueDate() + " (" + a.getPriority() + ")").reduce((a, b) -> a + "; " + b).orElse("No pending assignments");
        String examText = upcoming.stream().map(e -> e.getTitle() + " on " + e.getExamDate()).reduce((a, b) -> a + "; " + b).orElse("No upcoming exams");
        return "Subjects and current percentages: " + subjectText + "\nPending assignments: " + assignmentText + "\nUpcoming exams: " + examText + "\nGoal count: " + goals.findByUserIdOrderByCreatedAtDesc(userId).size();
    }
}
