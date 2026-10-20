
package college_management_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActivateStudentRequest(
        @NotBlank String token,

        @NotBlank
        @Size(min = 12, max = 72)
        String password
) {}
