package college_management_backend.service;

import college_management_backend.dto.ApplicationRequest;
import college_management_backend.dto.ApplicationResponse;
import college_management_backend.dto.ApplicationStatusRequest;
import college_management_backend.entity.Application;
import college_management_backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            AuditLogService auditLogService) {

        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
    }

    public List<ApplicationResponse> getAllApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    public ApplicationResponse getApplicationById(
            Long applicationId) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId));

        return new ApplicationResponse(application);
    }

    public List<ApplicationResponse> getApplicationsByUser(
            Long applicantUserId) {

        return applicationRepository
                .findByApplicantUserId(applicantUserId)
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    public List<ApplicationResponse> getApplicationsByStatus(
            String status) {

        return applicationRepository
                .findByStatus(status)
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    public ApplicationResponse createApplication(
            ApplicationRequest request) {

        Application application = new Application();

        application.setApplicantUserId(
                request.getApplicantUserId());

        application.setApplicationType(
                request.getApplicationType());

        application.setSubject(
                request.getSubject());

        application.setDescription(
                request.getDescription());

        application.setSubmittedAt(
                LocalDateTime.now());

        application.setStatus("PENDING");

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
                        + "\"}"
        );

        return new ApplicationResponse(savedApplication);
    }

    public ApplicationResponse updateApplication(
            Long applicationId,
            ApplicationRequest request) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId));

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
                request.getApplicantUserId());

        application.setApplicationType(
                request.getApplicationType());

        application.setSubject(
                request.getSubject());

        application.setDescription(
                request.getDescription());

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
                newValue
        );

        return new ApplicationResponse(updatedApplication);
    }

    public ApplicationResponse updateStatus(
            Long applicationId,
            ApplicationStatusRequest request) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId));

        String oldStatus = application.getStatus();

        application.setStatus(
                request.getStatus().toUpperCase());

        Application updatedApplication =
                applicationRepository.save(application);

        createAuditLog(
                updatedApplication,
                "STATUS_UPDATE",
                "{\"status\":\"" + oldStatus + "\"}",
                "{\"status\":\""
                        + updatedApplication.getStatus()
                        + "\"}"
        );

        return new ApplicationResponse(updatedApplication);
    }

    public void deleteApplication(Long applicationId) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found with ID: "
                                                + applicationId));

        createAuditLog(
                application,
                "DELETE",
                "{\"applicationId\":"
                        + application.getApplicationId()
                        + ",\"status\":\""
                        + application.getStatus()
                        + "\"}",
                null
        );

        applicationRepository.delete(application);
    }

    private void createAuditLog(
            Application application,
            String action,
            String oldValue,
            String newValue) {

        college_management_backend.dto.AuditLogRequest auditRequest =
                new college_management_backend.dto.AuditLogRequest();

        auditRequest.setUserId(
                application.getApplicantUserId());

        auditRequest.setAction(action);

        auditRequest.setTableName("applications");

        auditRequest.setRecordId(
                application.getApplicationId());

        auditRequest.setOldValue(oldValue);

        auditRequest.setNewValue(newValue);

        auditLogService.createAuditLog(auditRequest);
    }
}