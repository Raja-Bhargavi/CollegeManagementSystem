package college_management_backend.dto;

public class CourseResponse {

    private Long courseId;
    private String courseCode;
    private String courseName;
    private Integer credits;
    private String description;
    private Long departmentId;
    private String programLevel;

    public CourseResponse() {
    }

    public CourseResponse(
            Long courseId,
            String courseCode,
            String courseName,
            Integer credits,
            String description,
            Long departmentId,
            String programLevel
    ) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.description = description;
        this.departmentId = departmentId;
        this.programLevel = programLevel;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getProgramLevel() {
        return programLevel;
    }

    public void setProgramLevel(String programLevel) {
        this.programLevel = programLevel;
    }
}