package college_management_backend.controller;

import college_management_backend.dto.ApprovalRequest;
import college_management_backend.dto.ApprovalResponse;
import college_management_backend.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY','MANAGEMENT')")
    public List<ApprovalResponse> getApprovalsByApplication(
            @PathVariable Long applicationId) {

        return approvalService
                .getApprovalsByApplication(applicationId);
    }

    @GetMapping("/{approvalId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY','MANAGEMENT')")
    public ApprovalResponse getApprovalById(
            @PathVariable Long approvalId) {

        return approvalService.getApprovalById(approvalId);
    }

    @GetMapping("/approver/{approverUserId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY','MANAGEMENT')")
    public List<ApprovalResponse> getApprovalsByApprover(
            @PathVariable Long approverUserId) {

        return approvalService
                .getApprovalsByApprover(approverUserId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MANAGEMENT')")
    public ResponseEntity<ApprovalResponse> processApproval(
            @Valid @RequestBody ApprovalRequest request) {

        ApprovalResponse response =
                approvalService.processApproval(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}