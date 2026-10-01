package college_management_backend.dto;

public class CourseOfferingResponse {

    private Long offeringId;

    private Long courseId;
    private String courseCode;
    private String courseName;

    private Long sectionId;
    private String sectionName;

    private Long facultyId;
    private String facultyName;

    private String offeringStatus;

    public CourseOfferingResponse(
            Long offeringId,
            Long courseId,
            String courseCode,
            String courseName,
            Long sectionId,
            String sectionName,
            Long facultyId,
            String facultyName,
            String offeringStatus) {

        this.offeringId = offeringId;

        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;

        this.sectionId = sectionId;
        this.sectionName = sectionName;

        this.facultyId = facultyId;
        this.facultyName = facultyName;

        this.offeringStatus = offeringStatus;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public String getSectionName() {
        return sectionName;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public String getOfferingStatus() {
        return offeringStatus;
    }
}