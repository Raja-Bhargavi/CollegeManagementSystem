package college_management_backend.dto;

import java.time.LocalDate;

public class StudentResponse {

    private Long studentId;
    private String rollNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private Long programId;
    private Integer admissionYear;
    private Integer currentSemester;
    private String studentStatus;

    public StudentResponse(
            Long studentId,
            String rollNumber,
            String firstName,
            String lastName,
            LocalDate dateOfBirth,
            String gender,
            String phone,
            Long programId,
            Integer admissionYear,
            Integer currentSemester,
            String studentStatus) {

        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phone = phone;
        this.programId = programId;
        this.admissionYear = admissionYear;
        this.currentSemester = currentSemester;
        this.studentStatus = studentStatus;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getPhone() {
        return phone;
    }

    public Long getProgramId() {
        return programId;
    }

    public Integer getAdmissionYear() {
        return admissionYear;
    }

    public Integer getCurrentSemester() {
        return currentSemester;
    }

    public String getStudentStatus() {
        return studentStatus;
    }
}