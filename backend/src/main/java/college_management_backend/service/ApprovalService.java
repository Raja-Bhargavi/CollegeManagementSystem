package college_management_backend.service;

import college_management_backend.dto.ApprovalRequest;
import college_management_backend.dto.ApprovalResponse;
import college_management_backend.dto.AuditLogRequest;
import college_management_backend.dto.NotificationRequest;
import college_management_backend.entity.Approval;
import college_management_backend.entity.Application;
import college_management_backend.repository.ApprovalRepository;
import college_management_backend.repository.ApplicationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public ApprovalService(
            ApprovalRepository approvalRepository,
            ApplicationRepository applicationRepository,
            AuditLogService auditLogService,
            NotificationService notificationService) {

        this.approvalRepository = approvalRepository;
        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    public List<ApprovalResponse> getApprovalsByApplication(Long applicationId) {

        return approvalRepository.findByApplicationId(applicationId)
                .stream()
                .map(ApprovalResponse::new)
                .toList();
    }

    public ApprovalResponse getApprovalById(Long approvalId) {

        Approval approval = approvalRepository.findById(approvalId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Approval not found with ID: " + approvalId));

        return new ApprovalResponse(approval);
    }

    public List<ApprovalResponse> getApprovalsByApprover(Long approverUserId) {

        return approvalRepository.findByApproverUserId(approverUserId)
                .stream()
                .map(ApprovalResponse::new)
                .toList();
    }

    @Transactional
    public ApprovalResponse processApproval(ApprovalRequest request) {

        Application application = applicationRepository
                .findById(request.getApplicationId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with ID: "
                                        + request.getApplicationId()));

        String action = request.getAction()
                .trim()
                .toUpperCase();

        String previousStatus = application.getStatus();

        Approval approval = new Approval();

        approval.setApplicationId(request.getApplicationId());
        approval.setApproverUserId(request.getApproverUserId());
        approval.setAction(action);
        approval.setComments(request.getComments());
        approval.setActionDate(LocalDateTime.now());

        Approval savedApproval = approvalRepository.save(approval);

        if ("APPROVED".equals(action)) {

            application.setStatus("APPROVED");

        } else if ("REJECTED".equals(action)) {

            application.setStatus("REJECTED");

        } else if ("FORWARDED".equals(action)) {

            application.setStatus("FORWARDED");

        } else {
            throw new RuntimeException(
                    "Invalid approval action. Allowed values: APPROVED, REJECTED, FORWARDED");
        }

        applicationRepository.save(application);

        createAuditLog(
                request.getApproverUserId(),
                action,
                application,
                previousStatus
        );

        createNotification(application);

        return new ApprovalResponse(savedApproval);
    }

    private void createAuditLog(
            Long approverUserId,
            String action,
            Application application,
            String previousStatus) {

        AuditLogRequest auditRequest = new AuditLogRequest();

        auditRequest.setUserId(approverUserId);
        auditRequest.setAction(action);
        auditRequest.setTableName("applications");
        auditRequest.setRecordId(application.getApplicationId());

        auditRequest.setOldValue(
                "{\"status\":\"" + previousStatus + "\"}"
        );

        auditRequest.setNewValue(
                "{\"status\":\"" + application.getStatus() + "\"}"
        );

        auditLogService.createAuditLog(auditRequest);
    }

    private void createNotification(Application application) {

        NotificationRequest notificationRequest =
                new NotificationRequest();

        notificationRequest.setUserId(
                application.getApplicantUserId()
        );

        notificationRequest.setTitle(
                "Application " + application.getStatus()
        );

        notificationRequest.setMessage(
                "Your application #" +
                        application.getApplicationId() +
                        " has been " +
                        application.getStatus().toLowerCase() +
                        "."
        );

        notificationService.createNotification(
                notificationRequest
        );
    }
}