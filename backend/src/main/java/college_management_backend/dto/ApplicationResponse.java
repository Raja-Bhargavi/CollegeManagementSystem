package college_management_backend.dto;

import college_management_backend.entity.Application;

import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long applicationId;
    private Long applicantUserId;
    private String applicationType;
    private String subject;
    private String description;
    private LocalDateTime submittedAt;
    private String status;

    public ApplicationResponse(Application application) {
        this.applicationId = application.getApplicationId();
        this.applicantUserId = application.getApplicantUserId();
        this.applicationType = application.getApplicationType();
        this.subject = application.getSubject();
        this.description = application.getDescription();
        this.submittedAt = application.getSubmittedAt();
        this.status = application.getStatus();
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public Long getApplicantUserId() {
        return applicantUserId;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public String getSubject() {
        return subject;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public String getStatus() {
        return status;
    }
}