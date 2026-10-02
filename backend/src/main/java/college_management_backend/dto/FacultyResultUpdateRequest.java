package college_management_backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class FacultyResultUpdateRequest {

    @NotNull(message = "SGPA is required")
    @DecimalMin(
            value = "0.0",
            message = "SGPA cannot be negative"
    )
    @DecimalMax(
            value = "10.0",
            message = "SGPA cannot exceed 10.0"
    )
    private Double sgpa;

    @Size(
            max = 255,
            message = "Remarks must not exceed 255 characters"
    )
    private String remarks;

    @NotBlank(message = "Result status is required")
    private String resultStatus;

    public Double getSgpa() {
        return sgpa;
    }

    public void setSgpa(Double sgpa) {
        this.sgpa = sgpa;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }
}