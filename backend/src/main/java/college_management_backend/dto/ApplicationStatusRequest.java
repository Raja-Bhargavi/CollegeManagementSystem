package college_management_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ApplicationStatusRequest {

    @NotBlank(message = "Status is required")
    @Size(max = 30, message = "Status must not exceed 30 characters")
    private String status;

    @Size(
        max = 1000,
        message = "Management remarks must not exceed 1000 characters"
    )
    private String managementRemarks;

    private Long forwardedTo;

    public ApplicationStatusRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getManagementRemarks() {
        return managementRemarks;
    }

    public void setManagementRemarks(String managementRemarks) {
        this.managementRemarks = managementRemarks;
    }

    public Long getForwardedTo() {
        return forwardedTo;
    }

    public void setForwardedTo(Long forwardedTo) {
        this.forwardedTo = forwardedTo;
    }
}