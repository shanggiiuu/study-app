package com.studyapp.backend.service;

import com.studyapp.backend.entity.Document;
import com.studyapp.backend.entity.Subject;
import com.studyapp.backend.entity.User;
import com.studyapp.backend.exception.ResourceNotFoundException;
import com.studyapp.backend.repository.DocumentRepository;
import com.studyapp.backend.repository.SubjectRepository;
import com.studyapp.backend.repository.UserRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final GroqClient groqClient;

    public DocumentService(DocumentRepository documentRepository, SubjectRepository subjectRepository,
                            UserRepository userRepository, GroqClient groqClient) {
        this.documentRepository = documentRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.groqClient = groqClient;
    }

    public java.util.List<Document> listForUser(Long userId) {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Document findOwned(Long userId, Long id) {
        return documentRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    @Transactional
    public Document upload(Long userId, String title, Long subjectId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Document document = new Document();
        document.setUser(user);
        document.setTitle(title != null && !title.isBlank() ? title : file.getOriginalFilename());
        document.setOriginalFilename(file.getOriginalFilename());
        document.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        document.setByteSize(file.getSize());
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read uploaded file", e);
        }
        document.setContent(bytes);
        document.setExtractedText(extractText(document.getContentType(), bytes, document.getOriginalFilename()));

        if (subjectId != null) {
            Subject subject = subjectRepository.findByIdAndUserId(subjectId, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            document.setSubject(subject);
        }

        return documentRepository.save(document);
    }

    @Transactional
    public void delete(Long userId, Long id) {
        documentRepository.delete(findOwned(userId, id));
    }

    private static final String DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    private static final String PPTX_TYPE = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    private String extractText(String contentType, byte[] bytes, String filename) {
        try {
            if ("application/pdf".equals(contentType)) {
                try (PDDocument pdf = Loader.loadPDF(bytes)) {
                    return new PDFTextStripper().getText(pdf);
                }
            }
            if (contentType != null && contentType.startsWith("text/")) {
                return new String(bytes, StandardCharsets.UTF_8);
            }
            if (DOCX_TYPE.equals(contentType)) {
                return extractDocx(bytes);
            }
            if (PPTX_TYPE.equals(contentType)) {
                return extractPptx(bytes);
            }
            if (contentType != null && contentType.startsWith("image/")) {
                return groqClient.describeImage(bytes, contentType);
            }
            if (contentType != null && contentType.startsWith("audio/")) {
                return groqClient.transcribeAudio(bytes, filename);
            }
            if (contentType != null && contentType.startsWith("video/")) {
                byte[] audio = extractAudioTrack(bytes, filename);
                return audio != null ? groqClient.transcribeAudio(audio, "audio.mp3") : null;
            }
        } catch (Exception e) {
            log.warn("Failed to extract text from uploaded document (contentType={}): {}", contentType, e.getMessage());
        }
        return null;
    }

    private String extractDocx(byte[] bytes) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(new ByteArrayInputStream(bytes))) {
            StringBuilder sb = new StringBuilder();
            for (XWPFParagraph paragraph : doc.getParagraphs()) {
                sb.append(paragraph.getText()).append('\n');
            }
            return sb.toString();
        }
    }

    private String extractPptx(byte[] bytes) throws IOException {
        try (XMLSlideShow ppt = new XMLSlideShow(new ByteArrayInputStream(bytes))) {
            StringBuilder sb = new StringBuilder();
            for (XSLFSlide slide : ppt.getSlides()) {
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFTextShape textShape) {
                        sb.append(textShape.getText()).append('\n');
                    }
                }
                sb.append('\n');
            }
            return sb.toString();
        }
    }

    /** Extracts the audio track of a video file to a compressed mp3 using ffmpeg, which must be on PATH. */
    private byte[] extractAudioTrack(byte[] videoBytes, String filename) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("studyapp-video");
            String inputName = filename != null && !filename.isBlank() ? filename : "input.mp4";
            Path inputFile = tempDir.resolve("input-" + inputName.replaceAll("[^A-Za-z0-9._-]", "_"));
            Path outputFile = tempDir.resolve("audio.mp3");
            Files.write(inputFile, videoBytes);

            ProcessBuilder builder = new ProcessBuilder(
                    "ffmpeg", "-y", "-i", inputFile.toString(),
                    "-vn", "-ar", "16000", "-ac", "1", "-b:a", "64k",
                    outputFile.toString());
            builder.redirectErrorStream(true);
            Process process = builder.start();
            // Drain stdout/stderr so ffmpeg doesn't block on a full pipe buffer.
            process.getInputStream().readAllBytes();
            boolean finished = process.waitFor(180, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                log.warn("ffmpeg timed out extracting audio from video");
                return null;
            }
            if (process.exitValue() != 0 || !Files.exists(outputFile)) {
                log.warn("ffmpeg failed to extract audio from video (exit code {})", process.exitValue());
                return null;
            }
            return Files.readAllBytes(outputFile);
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("Failed to extract audio track from video: {}", e.getMessage());
            return null;
        } finally {
            if (tempDir != null) {
                try (var files = Files.walk(tempDir)) {
                    files.sorted(java.util.Comparator.reverseOrder()).forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {
                            // Best-effort cleanup of temp files.
                        }
                    });
                } catch (IOException ignored) {
                    // Best-effort cleanup of temp files.
                }
            }
        }
    }
}
