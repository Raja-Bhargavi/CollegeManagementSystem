package college_management_backend.dto;

import java.time.LocalDateTime;

import college_management_backend.entity.Application;

public class ApplicationResponse {

    private Long applicationId;
    private Long applicantUserId;
    private String applicationType;
    private String subject;
    private String description;
    private LocalDateTime submittedAt;
    private String status;

    private Long processedBy;
    private LocalDateTime processedAt;
    private String managementRemarks;
    private Long forwardedTo;

    public ApplicationResponse() {
    }

    public ApplicationResponse(Application application) {

        this.applicationId = application.getApplicationId();
        this.applicantUserId = application.getApplicantUserId();
        this.applicationType = application.getApplicationType();
        this.subject = application.getSubject();
        this.description = application.getDescription();
        this.submittedAt = application.getSubmittedAt();
        this.status = application.getStatus();

        this.processedBy = application.getProcessedBy();
        this.processedAt = application.getProcessedAt();
        this.managementRemarks = application.getManagementRemarks();
        this.forwardedTo = application.getForwardedTo();
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getApplicantUserId() {
        return applicantUserId;
    }

    public void setApplicantUserId(Long applicantUserId) {
        this.applicantUserId = applicantUserId;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(String applicationType) {
        this.applicationType = applicationType;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(Long processedBy) {
        this.processedBy = processedBy;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public String getManagementRemarks() {
        return managementRemarks;
    }

    public void setManagementRemarks(String managementRemarks) {
        this.managementRemarks = managementRemarks;
    }

    public Long getForwardedTo() {
        return forwardedTo;
    }

    public void setForwardedTo(Long forwardedTo) {
        this.forwardedTo = forwardedTo;
    }
}