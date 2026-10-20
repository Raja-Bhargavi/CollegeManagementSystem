
package college_management_backend.controller;

import college_management_backend.dto.AdmissionApplicationResponse;
import college_management_backend.repository.AdmissionApplicationProjection;
import college_management_backend.repository.AdmissionRequestRepository;

import college_management_backend.dto.AdmissionDecisionRequest;
import college_management_backend.entity.AdmissionRequest;
import college_management_backend.service.AdmissionService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/admissions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAdmissionsController {

    private final AdmissionRequestRepository admissionRepository;
    private final AdmissionService admissionService;

public AdminAdmissionsController(
        AdmissionRequestRepository admissionRepository,
        AdmissionService admissionService) {
    this.admissionRepository = admissionRepository;
    this.admissionService = admissionService;
}

    @GetMapping
    public List<AdmissionApplicationResponse> getApplications(
            @RequestParam(defaultValue = "PENDING") String status) {

        if (!List.of("PENDING", "APPROVED", "REJECTED").contains(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid application status."
            );
        }

        return admissionRepository.findApplicationsByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public AdmissionApplicationResponse getApplication(
            @PathVariable Long id) {

        return admissionRepository.findApplicationDetailsById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Admission application not found."
                ));
    }

    @PutMapping("/{id}/decision")
        public ResponseEntity<?> decide(
                @PathVariable Long id,
                @Valid @RequestBody AdmissionDecisionRequest request,
                Authentication authentication) {

        AdmissionRequest result = admissionService.decide(
                id,
                request.decision(),
                request.remarks(),
                authentication.getName()
        );

        return ResponseEntity.ok(Map.of(
                "applicationNumber", result.getApplicationNumber(),
                "status", result.getStatus(),
                "message", "Application " + result.getStatus().toLowerCase()
        ));
        }

    private AdmissionApplicationResponse toResponse(
            AdmissionApplicationProjection p) {

        return new AdmissionApplicationResponse(
                p.getAdmissionRequestId(),
                p.getApplicationNumber(),
                p.getFirstName(),
                p.getLastName(),
                p.getEmail(),
                p.getPhone(),
                p.getProgramName(),
                p.getDegreeType(),
                p.getDepartmentName(),
                p.getDateOfBirth(),
                p.getAdmissionYear(),
                p.getPreviousQualification(),
                p.getStatus(),
                p.getAdminRemarks(),
                p.getCreatedAt()
        );
    }

}
