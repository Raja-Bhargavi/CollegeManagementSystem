package college_management_backend.dto;

import jakarta.validation.constraints.*;

public class CourseRequest {

    @NotBlank(message = "Course code is required")
    @Size(max = 20, message = "Course code cannot exceed 20 characters")
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Size(max = 150, message = "Course name cannot exceed 150 characters")
    private String courseName;

    @NotNull(message = "Credits are required")
    @DecimalMin(value = "0.1", message = "Credits must be greater than 0")
    private Double credits;

    private String description;

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

    public Double getCredits() {
        return credits;
    }

    public void setCredits(Double credits) {
        this.credits = credits;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}