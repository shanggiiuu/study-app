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
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GroqClient {
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient client = HttpClient.newHttpClient();

    @Value("${app.ai.groq.api-key:}") private String apiKey;
    @Value("${app.ai.groq.model:openai/gpt-oss-20b}") private String model;
    @Value("${app.ai.groq.vision-model:meta-llama/llama-4-scout-17b-16e-instruct}") private String visionModel;
    @Value("${app.ai.groq.whisper-model:whisper-large-v3}") private String whisperModel;

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

    /** Transcribes/describes an image (e.g. a photo of a classroom whiteboard) into plain text. */
    public String describeImage(byte[] imageBytes, String contentType) {
        requireApiKey();
        String mediaType = contentType != null && !contentType.isBlank() ? contentType : "image/jpeg";
        String dataUrl = "data:" + mediaType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);
        try {
            Map<String, Object> body = Map.of(
                    "model", visionModel,
                    "temperature", 0.2,
                    "max_tokens", 1500,
                    "messages", List.of(Map.of(
                            "role", "user",
                            "content", List.of(
                                    Map.of("type", "text", "text",
                                            "Transcribe every word of readable text in this image exactly as written, " +
                                                    "then on new lines describe any diagrams, drawings, or layout that isn't plain text. " +
                                                    "This may be a photo of a classroom whiteboard or handwritten notes."),
                                    Map.of("type", "image_url", "image_url", Map.of("url", dataUrl))
                            )
                    ))
            );
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.groq.com/openai/v1/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey).header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq could not read this image. Check GROQ_VISION_MODEL.");
            }
            JsonNode content = mapper.readTree(response.body()).at("/choices/0/message/content");
            if (content.isMissingNode() || content.asText().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq returned an empty response for this image.");
            }
            return content.asText().trim();
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to reach Groq's vision model.");
        }
    }

    /** Transcribes spoken audio (raw audio file, or the extracted audio track of a video) into plain text. */
    public String transcribeAudio(byte[] audioBytes, String filename) {
        requireApiKey();
        try {
            String boundary = "----studyapp-" + UUID.randomUUID();
            byte[] multipartBody = buildMultipartBody(boundary, audioBytes, filename != null ? filename : "audio.mp3", whisperModel);

            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.groq.com/openai/v1/audio/transcriptions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(multipartBody)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq could not transcribe this audio. Check GROQ_WHISPER_MODEL.");
            }
            JsonNode text = mapper.readTree(response.body()).at("/text");
            if (text.isMissingNode() || text.asText().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Groq returned an empty transcript.");
            }
            return text.asText().trim();
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Unable to reach Groq's audio transcription service.");
        }
    }

    private void requireApiKey() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI features are not configured. Set GROQ_API_KEY on the backend.");
        }
    }

    private static byte[] buildMultipartBody(String boundary, byte[] fileBytes, String filename, String model) throws java.io.IOException {
        String lineBreak = "\r\n";
        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();

        out.write(("--" + boundary + lineBreak).getBytes(StandardCharsets.UTF_8));
        out.write(("Content-Disposition: form-data; name=\"model\"" + lineBreak + lineBreak).getBytes(StandardCharsets.UTF_8));
        out.write((model + lineBreak).getBytes(StandardCharsets.UTF_8));

        out.write(("--" + boundary + lineBreak).getBytes(StandardCharsets.UTF_8));
        out.write(("Content-Disposition: form-data; name=\"file\"; filename=\"" + filename + "\"" + lineBreak).getBytes(StandardCharsets.UTF_8));
        out.write(("Content-Type: application/octet-stream" + lineBreak + lineBreak).getBytes(StandardCharsets.UTF_8));
        out.write(fileBytes);
        out.write(lineBreak.getBytes(StandardCharsets.UTF_8));

        out.write(("--" + boundary + "--" + lineBreak).getBytes(StandardCharsets.UTF_8));
        return out.toByteArray();
    }
}
