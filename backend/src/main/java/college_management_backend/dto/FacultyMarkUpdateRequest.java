package college_management_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class FacultyMarkUpdateRequest {

    @NotNull(message = "Marks obtained are required")
    @DecimalMin(
            value = "0.0",
            message = "Marks cannot be negative"
    )
    private Double marksObtained;

    @Size(
            max = 255,
            message = "Remarks must not exceed 255 characters"
    )
    private String remarks;

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(
            Double marksObtained) {

        this.marksObtained = marksObtained;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {

        this.remarks = remarks;
    }
}