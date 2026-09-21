package college_management_backend.service;

import college_management_backend.dto.ApplicationDocumentRequest;
import college_management_backend.dto.ApplicationDocumentResponse;
import college_management_backend.entity.ApplicationDocument;
import college_management_backend.repository.ApplicationDocumentRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ApplicationDocumentService {

    private final ApplicationDocumentRepository documentRepository;

    @Value("${app.upload.dir}")
    private String uploadDirectory;

    public ApplicationDocumentService(
            ApplicationDocumentRepository documentRepository) {

        this.documentRepository = documentRepository;
    }

    public ApplicationDocumentResponse uploadDocument(
            ApplicationDocumentRequest request) {

        ApplicationDocument document = new ApplicationDocument();

        document.setApplicationId(request.getApplicationId());
        document.setDocumentType(request.getDocumentType());
        document.setFileName(request.getFileName());
        document.setFilePath(request.getFilePath());
        document.setUploadedAt(LocalDateTime.now());

        ApplicationDocument saved =
                documentRepository.save(document);

        return convertToResponse(saved);
    }

    public List<ApplicationDocumentResponse> getDocumentsByApplication(
            Long applicationId) {

        return documentRepository
                .findByApplicationId(applicationId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationDocumentResponse getDocumentById(Long documentId) {

    ApplicationDocument document =
            documentRepository.findById(documentId)
                    .orElseThrow(() ->
                            new RuntimeException("Document not found"));

    return convertToResponse(document);
}

    public void deleteDocument(Long documentId) {

        if (!documentRepository.existsById(documentId)) {
            throw new RuntimeException(
                    "Document not found with id: " + documentId);
        }

        documentRepository.deleteById(documentId);
    }

        public ApplicationDocumentResponse uploadFile(
                Long applicationId,
                String documentType,
                MultipartFile file)
                throws IOException {

        if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException(
                        "File must not be empty");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

                throw new IllegalArgumentException(
                        "Invalid file name");
        }

        String cleanFileName =
                Paths.get(originalFileName)
                        .getFileName()
                        .toString();

        String extension = "";

        int dotIndex = cleanFileName.lastIndexOf('.');

        if (dotIndex >= 0) {
                extension = cleanFileName.substring(dotIndex);
        }

        String storedFileName =
                UUID.randomUUID() + extension;

        Path applicationDirectory =
                Paths.get(
                        uploadDirectory,
                        "application-" + applicationId
                );

        Files.createDirectories(applicationDirectory);

        Path targetPath =
                applicationDirectory.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        ApplicationDocument document =
                new ApplicationDocument();

        document.setApplicationId(applicationId);
        document.setDocumentType(documentType);
        document.setFileName(cleanFileName);
        document.setFilePath(
                targetPath.toString()
        );
        document.setUploadedAt(LocalDateTime.now());

        ApplicationDocument saved =
                documentRepository.save(document);

        return convertToResponse(saved);
        }

    private ApplicationDocumentResponse convertToResponse(
            ApplicationDocument document) {

        ApplicationDocumentResponse response =
                new ApplicationDocumentResponse();

        response.setDocumentId(document.getDocumentId());
        response.setApplicationId(document.getApplicationId());
        response.setDocumentType(document.getDocumentType());
        response.setFileName(document.getFileName());
        response.setFilePath(document.getFilePath());
        response.setUploadedAt(document.getUploadedAt());

        return response;
    }

        public Resource downloadFile(Long documentId) {

    ApplicationDocument document =
            documentRepository.findById(documentId)
                    .orElseThrow(() ->
                            new RuntimeException("Document not found"));

    Path path =
            Paths.get(document.getFilePath());

    if (!Files.exists(path)) {
        throw new RuntimeException(
                "File not found at path: " +
                        path.toAbsolutePath());
    }

    if (!Files.isReadable(path)) {
        throw new RuntimeException(
                "File cannot be read: " +
                        path.toAbsolutePath());
    }

    try {
        return new UrlResource(path.toUri());
    } catch (MalformedURLException e) {
        throw new RuntimeException(
                "Invalid file path: " +
                        path.toAbsolutePath(), e);
    }
}

        public ApplicationDocument getDocumentEntityById(Long documentId) {

        return documentRepository.findById(documentId)
            .orElseThrow(() ->
                    new RuntimeException("Document not found"));
        }
}