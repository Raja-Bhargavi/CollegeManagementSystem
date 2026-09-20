package college_management_backend.dto;

public class CourseOfferingResponse {

    private Long offeringId;
    private Long courseId;
    private Long sectionId;
    private Long facultyId;
    private String offeringStatus;

    public CourseOfferingResponse(
            Long offeringId,
            Long courseId,
            Long sectionId,
            Long facultyId,
            String offeringStatus) {

        this.offeringId = offeringId;
        this.courseId = courseId;
        this.sectionId = sectionId;
        this.facultyId = facultyId;
        this.offeringStatus = offeringStatus;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public String getOfferingStatus() {
        return offeringStatus;
    }
}