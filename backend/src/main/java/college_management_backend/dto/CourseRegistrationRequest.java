package college_management_backend.dto;

import jakarta.validation.constraints.NotNull;

public class CourseRegistrationRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Offering ID is required")
    private Long offeringId;

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public void setOfferingId(Long offeringId) {
        this.offeringId = offeringId;
    }
}