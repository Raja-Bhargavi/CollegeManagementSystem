package college_management_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "management")
public class Management {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "management_id")
    private Long managementId;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(
            name = "employee_number",
            nullable = false,
            unique = true,
            length = 30
    )
    private String employeeNumber;

    @Column(
            name = "first_name",
            nullable = false,
            length = 50
    )
    private String firstName;

    @Column(
            name = "last_name",
            length = 50
    )
    private String lastName;

    @Column(
            name = "designation",
            nullable = false,
            length = 100
    )
    private String designation;

    public Management() {
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