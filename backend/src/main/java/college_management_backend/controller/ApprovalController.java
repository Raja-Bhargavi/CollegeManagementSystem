package college_management_backend.controller;

import college_management_backend.dto.ApprovalRequest;
import college_management_backend.dto.ApprovalResponse;
import college_management_backend.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<ApprovalResponse> getApprovalsByApplication(
            @PathVariable Long applicationId) {

        return approvalService
                .getApprovalsByApplication(applicationId);
    }

    @PostMapping
    public ResponseEntity<ApprovalResponse> processApproval(
            @Valid @RequestBody ApprovalRequest request) {

        ApprovalResponse response =
                approvalService.processApproval(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}