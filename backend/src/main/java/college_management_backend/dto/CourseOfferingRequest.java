package college_management_backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class CourseOfferingRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Section ID is required")
    private Long sectionId;

    @NotNull(message = "Faculty ID is required")
    private Long facultyId;

    @NotBlank(message = "Offering status is required")
    private String offeringStatus;

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public void setSectionId(Long sectionId) {
        this.sectionId = sectionId;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getOfferingStatus() {
        return offeringStatus;
    }

    public void setOfferingStatus(String offeringStatus) {
        this.offeringStatus = offeringStatus;
    }
}