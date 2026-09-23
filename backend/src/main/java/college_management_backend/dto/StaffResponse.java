package college_management_backend.dto;

import college_management_backend.entity.Staff;

import java.time.LocalDate;

public class StaffResponse {

    private Long staffId;
    private Long userId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String phone;
    private String designation;
    private Long departmentId;
    private LocalDate joiningDate;
    private String staffStatus;

    public StaffResponse() {
    }

    public StaffResponse(Staff staff) {
        this.staffId = staff.getStaffId();
        this.userId = staff.getUserId();
        this.employeeNumber = staff.getEmployeeNumber();
        this.firstName = staff.getFirstName();
        this.lastName = staff.getLastName();
        this.phone = staff.getPhone();
        this.designation = staff.getDesignation();
        this.departmentId = staff.getDepartmentId();
        this.joiningDate = staff.getJoiningDate();
        this.staffStatus = staff.getStaffStatus();
    }

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
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

    public String getStaffStatus() {
        return staffStatus;
    }

    public void setStaffStatus(String staffStatus) {
        this.staffStatus = staffStatus;
    }
}