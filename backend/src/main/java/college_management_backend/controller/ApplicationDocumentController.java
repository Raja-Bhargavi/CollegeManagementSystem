package college_management_backend.controller;

import college_management_backend.dto.ApplicationDocumentRequest;
import college_management_backend.dto.ApplicationDocumentResponse;
import college_management_backend.entity.ApplicationDocument;
import college_management_backend.service.ApplicationDocumentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;

@RestController
@RequestMapping("/api/application-documents")
public class ApplicationDocumentController {

    private final ApplicationDocumentService documentService;

    public ApplicationDocumentController(
            ApplicationDocumentService documentService) {

        this.documentService = documentService;
    }

    @GetMapping("/application/{applicationId}")
    public List<ApplicationDocumentResponse> getDocumentsByApplication(
            @PathVariable Long applicationId) {

        return documentService
                .getDocumentsByApplication(applicationId);
    }

    @GetMapping("/{documentId}")
    public ApplicationDocumentResponse getDocument(
            @PathVariable Long documentId) {

        return documentService.getDocumentById(documentId);
    }

    @PostMapping
    public ResponseEntity<ApplicationDocumentResponse> uploadDocument(
            @Valid @RequestBody ApplicationDocumentRequest request) {

        ApplicationDocumentResponse response =
                documentService.uploadDocument(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long documentId) {

        documentService.deleteDocument(documentId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<ApplicationDocumentResponse> uploadFile(
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file)
            throws IOException {

        ApplicationDocumentResponse response =
                documentService.uploadFile(
                        applicationId,
                        documentType,
                        file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

        @GetMapping("/download/{documentId}")
public ResponseEntity<Resource> downloadFile(
        @PathVariable Long documentId) {

    ApplicationDocument document =
            documentService.getDocumentEntityById(documentId);

    Resource resource =
            documentService.downloadFile(documentId);

    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" +
                            document.getFileName() +
                            "\""
            )
            .body(resource);
}


}