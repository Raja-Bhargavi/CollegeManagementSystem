package college_management_backend.dto;

import java.time.LocalDateTime;

public class CourseRegistrationResponse {

    private Long registrationId;

    private Long studentId;

    private Long offeringId;

    private String courseCode;

    private String courseName;

    private String sectionName;

    private String facultyName;

    private LocalDateTime registrationDate;

    private String status;

    public CourseRegistrationResponse(
            Long registrationId,
            Long studentId,
            Long offeringId,
            String courseCode,
            String courseName,
            String sectionName,
            String facultyName,
            LocalDateTime registrationDate,
            String status) {

        this.registrationId = registrationId;
        this.studentId = studentId;
        this.offeringId = offeringId;

        this.courseCode = courseCode;
        this.courseName = courseName;
        this.sectionName = sectionName;
        this.facultyName = facultyName;

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

    public String getCourseCode() {
        return courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getSectionName() {
        return sectionName;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public String getStatus() {
        return status;
    }
}