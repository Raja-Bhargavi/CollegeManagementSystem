package college_management_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "applicant_user_id", nullable = false)
    private Long applicantUserId;

    @Column(name = "application_type", nullable = false, length = 50)
    private String applicationType;

    @Column(name = "subject", nullable = false, length = 200)
    private String subject;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    // Management workflow fields

    @Column(name = "processed_by")
    private Long processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "management_remarks", length = 1000)
    private String managementRemarks;

    @Column(name = "forwarded_to")
    private Long forwardedTo;

    public Application() {
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