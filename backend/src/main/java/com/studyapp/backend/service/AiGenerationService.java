package com.studyapp.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiGenerationService {

    private static final int MAX_SOURCE_CHARS = 12000;

    public record GeneratedCard(String front, String back) {}

    public record GeneratedQuestion(String type, String question, List<String> options, String correctAnswer, String explanation) {}

    private final GroqClient groqClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public AiGenerationService(GroqClient groqClient) {
        this.groqClient = groqClient;
    }

    public List<GeneratedCard> generateFlashcards(String sourceText, int count) {
        String system = "You are a study-tool generator. Given source material, produce concise flashcards testing the key facts and concepts. "
                + "Respond with ONLY strict JSON, no markdown fences, no commentary, matching exactly this shape: "
                + "{\"cards\":[{\"front\":\"question or term\",\"back\":\"answer or definition\"}]}";
        String user = "Generate exactly " + count + " flashcards from this material:\n\n" + truncate(sourceText);
        JsonNode root = parseJson(groqClient.completeJson(system, user, 2000));
        List<GeneratedCard> cards = new ArrayList<>();
        for (JsonNode node : root.path("cards")) {
            String front = node.path("front").asText("").trim();
            String back = node.path("back").asText("").trim();
            if (!front.isEmpty() && !back.isEmpty()) {
                cards.add(new GeneratedCard(front, back));
            }
        }
        if (cards.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI did not return any usable flashcards, try again.");
        }
        return cards;
    }

    public String generateNotes(String sourceText) {
        String system = "You are a study-tool generator. Given source material, produce well-structured study notes using ONLY: "
                + "\"## \" headings, \"- \" bullet points for key facts, and **bold** for the most important terms. "
                + "Do NOT use markdown tables, HTML tags, or horizontal rule separators like \"---\" — use a heading to start each new section instead. "
                + "Be concise and accurate; do not invent facts not present in the material.";
        String user = "Summarize this material into study notes:\n\n" + truncate(sourceText);
        String notes = groqClient.complete(system, user, 1500);
        if (notes == null || notes.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI did not return any notes, try again.");
        }
        return notes;
    }

    public List<GeneratedQuestion> generateQuiz(String sourceText, int count, String type) {
        String typeInstruction = switch (type) {
            case "MCQ" -> "All questions must be type \"MCQ\" with exactly 4 plausible \"options\" and \"correctAnswer\" equal to one of the options verbatim.";
            case "FILL_BLANK" -> "All questions must be type \"FILL_BLANK\" with \"options\" as an empty array and \"correctAnswer\" as the short expected answer.";
            default -> "Mix both types: \"MCQ\" (with exactly 4 \"options\" and \"correctAnswer\" equal to one of them verbatim) and \"FILL_BLANK\" (with \"options\" as an empty array and a short \"correctAnswer\").";
        };
        String system = "You are a study-tool generator. Given source material, produce quiz questions testing understanding of it. " + typeInstruction
                + " Include a brief \"explanation\" for each answer. Respond with ONLY strict JSON, no markdown fences, no commentary, matching exactly this shape: "
                + "{\"questions\":[{\"type\":\"MCQ\",\"question\":\"...\",\"options\":[\"...\"],\"correctAnswer\":\"...\",\"explanation\":\"...\"}]}";
        String user = "Generate exactly " + count + " quiz questions from this material:\n\n" + truncate(sourceText);
        JsonNode root = parseJson(groqClient.completeJson(system, user, 2500));
        List<GeneratedQuestion> questions = new ArrayList<>();
        for (JsonNode node : root.path("questions")) {
            String qType = node.path("type").asText("MCQ").trim().toUpperCase();
            if (!qType.equals("MCQ") && !qType.equals("FILL_BLANK")) qType = "MCQ";
            String question = node.path("question").asText("").trim();
            String correctAnswer = node.path("correctAnswer").asText("").trim();
            String explanation = node.path("explanation").asText("").trim();
            List<String> options = new ArrayList<>();
            for (JsonNode opt : node.path("options")) options.add(opt.asText("").trim());
            if (!question.isEmpty() && !correctAnswer.isEmpty()) {
                questions.add(new GeneratedQuestion(qType, question, options, correctAnswer, explanation));
            }
        }
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI did not return any usable quiz questions, try again.");
        }
        return questions;
    }

    public String chatAboutDocument(String sourceText, String question) {
        String system = "You are StudyDesk's document tutor. Answer the student's question using ONLY the supplied document excerpt. "
                + "If the answer isn't in the excerpt, say so plainly instead of guessing. Be concise and clear.";
        String user = "Document excerpt:\n" + truncate(sourceText) + "\n\nQuestion: " + question;
        return groqClient.complete(system, user, 600);
    }

    private String truncate(String text) {
        if (text == null) return "";
        return text.length() > MAX_SOURCE_CHARS ? text.substring(0, MAX_SOURCE_CHARS) : text;
    }

    private JsonNode parseJson(String raw) {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```(json)?", "").replaceFirst("```\\s*$", "").trim();
        }
        try {
            return mapper.readTree(cleaned);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI returned an unexpected format, try again.");
        }
    }
}
