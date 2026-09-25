package college_management_backend.controller;

import college_management_backend.dto.ApplicationRequest;
import college_management_backend.dto.ApplicationResponse;
import college_management_backend.dto.ApplicationStatusRequest;
import college_management_backend.service.ApplicationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<ApplicationResponse>>
    getAllApplications() {

        return ResponseEntity.ok(
                applicationService.getAllApplications()
        );
    }

    @GetMapping("/{applicationId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<ApplicationResponse>
    getApplicationById(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(applicationId)
        );
    }

    @GetMapping("/user/{applicantUserId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<ApplicationResponse>>
    getApplicationsByUser(
            @PathVariable Long applicantUserId) {

        return ResponseEntity.ok(
                applicationService
                        .getApplicationsByUser(applicantUserId)
        );
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<ApplicationResponse>>
    getApplicationsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                applicationService
                        .getApplicationsByStatus(status)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApplicationResponse>
    createApplication(
            @Valid @RequestBody ApplicationRequest request) {

        ApplicationResponse response =
                applicationService.createApplication(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{applicationId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApplicationResponse>
    updateApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationRequest request) {

        return ResponseEntity.ok(
                applicationService.updateApplication(
                        applicationId,
                        request
                )
        );
    }

    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MANAGEMENT')")
    public ResponseEntity<ApplicationResponse>
    updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusRequest request) {

        return ResponseEntity.ok(
                applicationService.updateStatus(
                        applicationId,
                        request
                )
        );
    }

    @DeleteMapping("/{applicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long applicationId) {

        applicationService.deleteApplication(applicationId);

        return ResponseEntity.noContent().build();
    }
}