package college_management_backend.controller;

import college_management_backend.dto.ExaminationRequest;
import college_management_backend.dto.ExaminationResponse;
import college_management_backend.service.ExaminationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
@SecurityRequirement(name = "bearerAuth")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(
            ExaminationService examinationService) {

        this.examinationService = examinationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<ExaminationResponse> getAllExaminations() {

        return examinationService.getAllExaminations();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ExaminationResponse getExaminationById(
            @PathVariable Long id) {

        return examinationService.getExaminationById(id);
    }

    @GetMapping("/offering/{offeringId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<ExaminationResponse> getExaminationsByOffering(
            @PathVariable Long offeringId) {

        return examinationService
                .getExaminationsByOffering(offeringId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<ExaminationResponse> createExamination(
            @Valid @RequestBody ExaminationRequest request) {

        ExaminationResponse response =
                examinationService.createExamination(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ExaminationResponse updateExamination(
            @PathVariable Long id,
            @Valid @RequestBody ExaminationRequest request) {

        return examinationService.updateExamination(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExamination(
            @PathVariable Long id) {

        examinationService.deleteExamination(id);

        return ResponseEntity.noContent().build();
    }
}