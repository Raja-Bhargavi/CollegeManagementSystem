package college_management_backend.service;

import college_management_backend.dto.ApplicationRequest;
import college_management_backend.dto.ApplicationResponse;
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

    public ApplicationResponse getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found with ID: " + applicationId));

        return new ApplicationResponse(application);
    }

    public List<ApplicationResponse> getApplicationsByUser(Long applicantUserId) {
        return applicationRepository.findByApplicantUserId(applicantUserId)
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    public List<ApplicationResponse> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status)
                .stream()
                .map(ApplicationResponse::new)
                .toList();
    }

    public ApplicationResponse createApplication(ApplicationRequest request) {

        Application application = new Application();

        application.setApplicantUserId(request.getApplicantUserId());
        application.setApplicationType(request.getApplicationType());
        application.setSubject(request.getSubject());
        application.setDescription(request.getDescription());

        application.setSubmittedAt(LocalDateTime.now());
        application.setStatus("PENDING");

        Application savedApplication =
                applicationRepository.save(application);

        college_management_backend.dto.AuditLogRequest auditRequest =
        new college_management_backend.dto.AuditLogRequest();

auditRequest.setUserId(request.getApplicantUserId());
auditRequest.setAction("CREATE");
auditRequest.setTableName("applications");
auditRequest.setRecordId(savedApplication.getApplicationId());
auditRequest.setOldValue(null);

auditRequest.setNewValue(
        "{\"applicationId\":"
                + savedApplication.getApplicationId()
                + ",\"status\":\""
                + savedApplication.getStatus()
                + "\"}"
);

auditLogService.createAuditLog(auditRequest);        

        return new ApplicationResponse(savedApplication);
    }
}