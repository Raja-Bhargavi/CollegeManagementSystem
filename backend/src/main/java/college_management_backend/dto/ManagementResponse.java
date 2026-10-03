package college_management_backend.dto;

import college_management_backend.entity.Management;

public class ManagementResponse {

    private Long managementId;
    private Long userId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String designation;

    public ManagementResponse() {
    }

    public ManagementResponse(Management management) {

        this.managementId =
                management.getManagementId();

        this.userId =
                management.getUserId();

        this.employeeNumber =
                management.getEmployeeNumber();

        this.firstName =
                management.getFirstName();

        this.lastName =
                management.getLastName();

        this.designation =
                management.getDesignation();
    }

    public Long getManagementId() {
        return managementId;
    }

    public void setManagementId(Long managementId) {
        this.managementId = managementId;
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}