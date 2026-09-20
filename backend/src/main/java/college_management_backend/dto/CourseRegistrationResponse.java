package college_management_backend.dto;

import java.time.LocalDateTime;

public class CourseRegistrationResponse {

    private Long registrationId;
    private Long studentId;
    private Long offeringId;
    private LocalDateTime registrationDate;
    private String status;

    public CourseRegistrationResponse(
            Long registrationId,
            Long studentId,
            Long offeringId,
            LocalDateTime registrationDate,
            String status) {

        this.registrationId = registrationId;
        this.studentId = studentId;
        this.offeringId = offeringId;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public String getStatus() {
        return status;
    }
}