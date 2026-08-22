package com.studyapp.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class GroqClient {
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient client = HttpClient.newHttpClient();

    @Value("${app.ai.groq.api-key:}") private String apiKey;
    @Value("${app.ai.groq.model:openai/gpt-oss-20b}") private String model;

    public String complete(String systemPrompt, String userPrompt) {
        return complete(systemPrompt, userPrompt, 500);
    }

    public String complete(String systemPrompt, String userPrompt, int maxTokens) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI features are not configured. Set GROQ_API_KEY on the backend.");
        }
        try {
            Map<String, Object> body = Map.of("model", model, "temperature", 0.4, "max_tokens", maxTokens, "messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", userPrompt)
            ));
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey).header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq could not fulfill the request. Check GROQ_API_KEY and GROQ_MODEL.");
            }
            JsonNode content = mapper.readTree(response.body()).at("/choices/0/message/content");
            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq returned an empty response.");
            }
            return content.asText().trim();
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to reach Groq AI service.");
        }
    }

    /** Same call, for prompts that instruct the model to return strict JSON. */
    public String completeJson(String systemPrompt, String userPrompt, int maxTokens) {
        return complete(systemPrompt, userPrompt, maxTokens);
    }
}
