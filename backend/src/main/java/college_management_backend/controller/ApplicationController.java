package college_management_backend.controller;

import college_management_backend.dto.ApplicationRequest;
import college_management_backend.dto.ApplicationResponse;
import college_management_backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<ApplicationResponse> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/{applicationId}")
    public ApplicationResponse getApplicationById(
            @PathVariable Long applicationId) {

        return applicationService.getApplicationById(applicationId);
    }

    @GetMapping("/user/{applicantUserId}")
    public List<ApplicationResponse> getApplicationsByUser(
            @PathVariable Long applicantUserId) {

        return applicationService.getApplicationsByUser(applicantUserId);
    }

    @GetMapping("/status/{status}")
    public List<ApplicationResponse> getApplicationsByStatus(
            @PathVariable String status) {

        return applicationService.getApplicationsByStatus(status);
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody ApplicationRequest request) {

        ApplicationResponse response =
                applicationService.createApplication(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}