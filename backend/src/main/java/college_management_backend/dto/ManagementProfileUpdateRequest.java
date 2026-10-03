package college_management_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ManagementProfileUpdateRequest {

    @NotBlank(message = "First name is required")
    @Size(
            max = 50,
            message = "First name must not exceed 50 characters"
    )
    private String firstName;

    @Size(
            max = 50,
            message = "Last name must not exceed 50 characters"
    )
    private String lastName;

    @NotBlank(message = "Designation is required")
    @Size(
            max = 100,
            message = "Designation must not exceed 100 characters"
    )
    private String designation;

    public ManagementProfileUpdateRequest() {
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