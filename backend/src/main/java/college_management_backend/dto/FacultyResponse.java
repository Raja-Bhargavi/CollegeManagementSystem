package college_management_backend.dto;

import college_management_backend.entity.Faculty;

import java.time.LocalDate;

public class FacultyResponse {

    private Long facultyId;
    private Long userId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String phone;
    private String designation;
    private Long departmentId;
    private LocalDate joiningDate;
    private String facultyStatus;

    public FacultyResponse() {
    }

    public FacultyResponse(Faculty faculty) {
        this.facultyId = faculty.getFacultyId();
        this.userId = faculty.getUserId();
        this.employeeNumber = faculty.getEmployeeNumber();
        this.firstName = faculty.getFirstName();
        this.lastName = faculty.getLastName();
        this.phone = faculty.getPhone();
        this.designation = faculty.getDesignation();
        this.departmentId = faculty.getDepartmentId();
        this.joiningDate = faculty.getJoiningDate();
        this.facultyStatus = faculty.getFacultyStatus();
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getFacultyStatus() {
        return facultyStatus;
    }

    public void setFacultyStatus(String facultyStatus) {
        this.facultyStatus = facultyStatus;
    }
}