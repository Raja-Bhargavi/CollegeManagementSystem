package college_management_backend.dto;

public class CourseResponse {

    private Long courseId;
    private String courseCode;
    private String courseName;
    private Double credits;
    private String description;

    public CourseResponse(
            Long courseId,
            String courseCode,
            String courseName,
            Double credits,
            String description) {

        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.description = description;
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

    public Double getCredits() {
        return credits;
    }

    public String getDescription() {
        return description;
    }
}