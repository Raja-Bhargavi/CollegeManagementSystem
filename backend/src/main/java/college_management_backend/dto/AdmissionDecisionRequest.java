
package college_management_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdmissionDecisionRequest(
    @NotBlank
    String decision,

    @Size(max = 1000)
    String remarks
) {}
