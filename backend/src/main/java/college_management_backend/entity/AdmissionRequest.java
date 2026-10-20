
package college_management_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_requests")
public class AdmissionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admission_request_id")
    private Long admissionRequestId;

    @Column(name = "application_number", nullable = false, unique = true)
    private String applicationNumber;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "date_of_birth", nullable = false)
    private java.time.LocalDate dateOfBirth;

    private String gender;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String address;
    private String city;
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "program_id", nullable = false)
    private Long programId;

    @Column(name = "admission_year", nullable = false)
    private Integer admissionYear;

    @Column(name = "previous_qualification")
    private String previousQualification;

    @Column(name = "previous_percentage", precision = 5, scale = 2)
    private BigDecimal previousPercentage;

    @Column(name = "document_path")
    private String documentPath;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "admin_remarks")
    private String adminRemarks;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    public Long getAdmissionRequestId() { return admissionRequestId; }
    public void setAdmissionRequestId(Long id) { this.admissionRequestId = id; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String value) { this.applicationNumber = value; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String value) { this.firstName = value; }

    public String getLastName() { return lastName; }
    public void setLastName(String value) { this.lastName = value; }

    public java.time.LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(java.time.LocalDate value) { this.dateOfBirth = value; }

    public String getGender() { return gender; }
    public void setGender(String value) { this.gender = value; }

    public String getEmail() { return email; }
    public void setEmail(String value) { this.email = value; }

    public String getPhone() { return phone; }
    public void setPhone(String value) { this.phone = value; }

    public String getAddress() { return address; }
    public void setAddress(String value) { this.address = value; }

    public String getCity() { return city; }
    public void setCity(String value) { this.city = value; }

    public String getState() { return state; }
    public void setState(String value) { this.state = value; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String value) { this.postalCode = value; }

    public Long getProgramId() { return programId; }
    public void setProgramId(Long value) { this.programId = value; }

    public Integer getAdmissionYear() { return admissionYear; }
    public void setAdmissionYear(Integer value) { this.admissionYear = value; }

    public String getPreviousQualification() { return previousQualification; }
    public void setPreviousQualification(String value) { this.previousQualification = value; }

    public BigDecimal getPreviousPercentage() { return previousPercentage; }
    public void setPreviousPercentage(BigDecimal value) { this.previousPercentage = value; }

    public String getDocumentPath() { return documentPath; }
    public void setDocumentPath(String value) { this.documentPath = value; }

    public String getStatus() { return status; }
    public void setStatus(String value) { this.status = value; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String value) { this.adminRemarks = value; }

    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long value) { this.reviewedBy = value; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime value) { this.reviewedAt = value; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
