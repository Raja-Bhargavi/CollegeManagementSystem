package college_management_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FacultyAttendanceResponse {

    private Long attendanceId;

    private Long registrationId;

    private Long studentId;

    private String courseCode;
    private String courseName;

    private String sectionName;

    private String studentName;
    private String rollNumber;

    private LocalDate attendanceDate;

    private String status;

    private LocalDateTime markedAt;

    public FacultyAttendanceResponse(
            Long attendanceId,
            Long registrationId,
            Long studentId,
            String courseCode,
            String courseName,
            String sectionName,
            String studentName,
            String rollNumber,
            LocalDate attendanceDate,
            String status,
            LocalDateTime markedAt) {

        this.attendanceId = attendanceId;
        this.registrationId = registrationId;
        this.studentId = studentId;

        this.courseCode = courseCode;
        this.courseName = courseName;
        this.sectionName = sectionName;

        this.studentName = studentName;
        this.rollNumber = rollNumber;

        this.attendanceDate = attendanceDate;
        this.status = status;
        this.markedAt = markedAt;
    }

    public Long getAttendanceId() {
        return attendanceId;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public Long getStudentId() {
        return studentId;
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

    public String getStudentName() {
        return studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }
}