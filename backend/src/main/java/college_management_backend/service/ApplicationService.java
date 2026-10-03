package college_management_backend.service;

import college_management_backend.dto.ApplicationRequest;
import college_management_backend.dto.ApplicationResponse;
import college_management_backend.dto.ApplicationStatusRequest;
import college_management_backend.dto.AuditLogRequest;
import college_management_backend.entity.Application;
import college_management_backend.entity.User;
import college_management_backend.repository.ApplicationRepository;
import college_management_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            AuditLogService auditLogService,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public List<ApplicationResponse> getAllApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public ApplicationResponse getApplicationById(
            Long applicationId) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId
                                )
                        );

        return new ApplicationResponse(application);
    }

    // =========================================================
    // GET BY USER
    // =========================================================

    public List<ApplicationResponse> getApplicationsByUser(
            Long applicantUserId) {

        return applicationRepository
                .findByApplicantUserId(applicantUserId)
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    // =========================================================
    // GET BY STATUS
    // =========================================================

    public List<ApplicationResponse> getApplicationsByStatus(
            String status) {

        return applicationRepository
                .findByStatus(status.toUpperCase())
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    // =========================================================
    // CREATE APPLICATION
    // =========================================================

    @Transactional
    public ApplicationResponse createApplication(
            ApplicationRequest request) {

        Application application = new Application();

        application.setApplicantUserId(
                request.getApplicantUserId()
        );

        application.setApplicationType(
                request.getApplicationType()
        );

        application.setSubject(
                request.getSubject()
        );

        application.setDescription(
                request.getDescription()
        );

        application.setSubmittedAt(
                LocalDateTime.now()
        );

        application.setStatus("PENDING");

        // Management workflow fields remain empty
        // until Staff/Admin/Management processes the application.
        application.setProcessedBy(null);
        application.setProcessedAt(null);
        application.setManagementRemarks(null);
        application.setForwardedTo(null);

        Application savedApplication =
                applicationRepository.save(application);

        createAuditLog(
                savedApplication,
                "CREATE",
                null,
                "{\"applicationId\":"
                        + savedApplication.getApplicationId()
                        + ",\"status\":\""
                        + savedApplication.getStatus()
                        + "\"}",
                savedApplication.getApplicantUserId()
        );

        return new ApplicationResponse(savedApplication);
    }

    // =========================================================
    // FULL UPDATE
    // ADMIN ONLY
    // =========================================================

    @Transactional
    public ApplicationResponse updateApplication(
            Long applicationId,
            ApplicationRequest request) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId
                                )
                        );

        String oldValue =
                "{\"applicationId\":"
                        + application.getApplicationId()
                        + ",\"applicationType\":\""
                        + application.getApplicationType()
                        + "\",\"subject\":\""
                        + application.getSubject()
                        + "\",\"status\":\""
                        + application.getStatus()
                        + "\"}";

        application.setApplicantUserId(
                request.getApplicantUserId()
        );

        application.setApplicationType(
                request.getApplicationType()
        );

        application.setSubject(
                request.getSubject()
        );

        application.setDescription(
                request.getDescription()
        );

        Application updatedApplication =
                applicationRepository.save(application);

        String newValue =
                "{\"applicationId\":"
                        + updatedApplication.getApplicationId()
                        + ",\"applicationType\":\""
                        + updatedApplication.getApplicationType()
                        + "\",\"subject\":\""
                        + updatedApplication.getSubject()
                        + "\",\"status\":\""
                        + updatedApplication.getStatus()
                        + "\"}";

        createAuditLog(
                updatedApplication,
                "UPDATE",
                oldValue,
                newValue,
                updatedApplication.getApplicantUserId()
        );

        return new ApplicationResponse(updatedApplication);
    }

    // =========================================================
    // PROCESS APPLICATION
    // ADMIN / STAFF / MANAGEMENT
    // =========================================================

    @Transactional
    public ApplicationResponse updateStatus(
            Long applicationId,
            ApplicationStatusRequest request,
            String processorUsername) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId
                                )
                        );

        // -----------------------------------------------------
        // Find the authenticated user who is processing it
        // -----------------------------------------------------

        User processor =
                userRepository
                        .findByUsername(processorUsername)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Processor user not found: "
                                                + processorUsername
                                )
                        );

        String oldStatus =
                application.getStatus();

        String newStatus =
                request.getStatus()
                        .trim()
                        .toUpperCase();

        // -----------------------------------------------------
        // Validate application workflow status
        // -----------------------------------------------------

        if (!isValidWorkflowStatus(newStatus)) {

            throw new IllegalArgumentException(
                    "Invalid application status: "
                            + newStatus
                            + ". Allowed statuses are: "
                            + "PENDING, UNDER_REVIEW, FORWARDED, "
                            + "APPROVED, REJECTED"
            );
        }

        // -----------------------------------------------------
        // Update workflow information
        // -----------------------------------------------------

        application.setStatus(newStatus);

        application.setProcessedBy(
                processor.getUserId()
        );

        application.setProcessedAt(
                LocalDateTime.now()
        );

        application.setManagementRemarks(
                request.getManagementRemarks()
        );

        application.setForwardedTo(
                request.getForwardedTo()
        );

        Application updatedApplication =
                applicationRepository.save(application);

        // -----------------------------------------------------
        // Audit log
        // IMPORTANT:
        // The processor is recorded, not the applicant.
        // -----------------------------------------------------

        String oldValue =
                "{\"status\":\""
                        + oldStatus
                        + "\"}";

        String newValue =
                "{\"status\":\""
                        + updatedApplication.getStatus()
                        + "\",\"processedBy\":"
                        + updatedApplication.getProcessedBy()
                        + ",\"processedAt\":\""
                        + updatedApplication.getProcessedAt()
                        + "\",\"managementRemarks\":\""
                        + escapeJson(
                                updatedApplication
                                        .getManagementRemarks()
                        )
                        + "\",\"forwardedTo\":"
                        + updatedApplication.getForwardedTo()
                        + "}";

        createAuditLog(
                updatedApplication,
                "STATUS_UPDATE",
                oldValue,
                newValue,
                processor.getUserId()
        );

        return new ApplicationResponse(updatedApplication);
    }

    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    @Transactional
    public void deleteApplication(
            Long applicationId) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId
                                )
                        );

        createAuditLog(
                application,
                "DELETE",
                "{\"applicationId\":"
                        + application.getApplicationId()
                        + ",\"status\":\""
                        + application.getStatus()
                        + "\"}",
                null,
                application.getApplicantUserId()
        );

        applicationRepository.delete(application);
    }

    // =========================================================
    // VALIDATE WORKFLOW STATUS
    // =========================================================

    private boolean isValidWorkflowStatus(
            String status) {

        return status.equals("PENDING")
                || status.equals("UNDER_REVIEW")
                || status.equals("FORWARDED")
                || status.equals("APPROVED")
                || status.equals("REJECTED");
    }

    // =========================================================
    // CREATE AUDIT LOG
    // =========================================================

    private void createAuditLog(
            Application application,
            String action,
            String oldValue,
            String newValue,
            Long actorUserId) {

        AuditLogRequest auditRequest =
                new AuditLogRequest();

        auditRequest.setUserId(actorUserId);

        auditRequest.setAction(action);

        auditRequest.setTableName(
                "applications"
        );

        auditRequest.setRecordId(
                application.getApplicationId()
        );

        auditRequest.setOldValue(
                oldValue
        );

        auditRequest.setNewValue(
                newValue
        );

        auditLogService.createAuditLog(
                auditRequest
        );
    }

    // =========================================================
    // SIMPLE JSON ESCAPE
    // =========================================================

    private String escapeJson(
            String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}