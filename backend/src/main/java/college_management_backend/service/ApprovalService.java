package college_management_backend.service;

import college_management_backend.dto.ApprovalRequest;
import college_management_backend.dto.ApprovalResponse;
import college_management_backend.entity.Approval;
import college_management_backend.entity.Application;
import college_management_backend.repository.ApprovalRepository;
import college_management_backend.repository.ApplicationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import college_management_backend.dto.AuditLogRequest;
import college_management_backend.dto.NotificationRequest;

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

    @Transactional
    public ApprovalResponse processApproval(ApprovalRequest request) {

        Application application = applicationRepository
                .findById(request.getApplicationId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found with ID: "
                                        + request.getApplicationId()));

        String previousStatus = application.getStatus();

        Approval approval = new Approval();

        approval.setApplicationId(request.getApplicationId());
        approval.setApproverUserId(request.getApproverUserId());
        approval.setAction(request.getAction());
        approval.setComments(request.getComments());
        approval.setActionDate(LocalDateTime.now());

        Approval savedApproval = approvalRepository.save(approval);

        if ("APPROVED".equalsIgnoreCase(request.getAction())) {

            application.setStatus("APPROVED");
            applicationRepository.save(application);

        } else if ("REJECTED".equalsIgnoreCase(request.getAction())) {

            application.setStatus("REJECTED");
            applicationRepository.save(application);

        } else if ("FORWARDED".equalsIgnoreCase(request.getAction())) {

            application.setStatus("FORWARDED");
            applicationRepository.save(application);
        }

        // Create audit log
        AuditLogRequest auditRequest = new AuditLogRequest();

        auditRequest.setUserId(request.getApproverUserId());
        auditRequest.setAction(request.getAction());
        auditRequest.setTableName("applications");
        auditRequest.setRecordId(application.getApplicationId());

        auditRequest.setOldValue(
                "{\"status\":\"" +
                        previousStatus +
                        "\"}"
        );

        auditRequest.setNewValue(
                "{\"status\":\"" +
                        application.getStatus() +
                        "\"}"
        );

        auditLogService.createAuditLog(auditRequest);


        // Create notification for applicant
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

        return new ApprovalResponse(savedApproval);
    }

        
}