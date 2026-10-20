
package college_management_backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record AdmissionSubmissionRequest(
    @NotBlank @Size(max = 50)
    String firstName,

    @NotBlank @Size(max = 50)
    String lastName,

    @NotNull @Past
    LocalDate dateOfBirth,

    @Size(max = 20)
    String gender,

    @NotBlank @Email @Size(max = 100)
    String email,

    @NotBlank @Size(max = 20)
    String phone,

    @Size(max = 5000)
    String address,

    @Size(max = 100)
    String city,

    @Size(max = 100)
    String state,

    @Size(max = 15)
    String postalCode,

    @NotNull @Positive
    Long programId,

    @NotNull @Min(2020) @Max(2100)
    Integer admissionYear,

    @Size(max = 100)
    String previousQualification,

    @DecimalMin("0.00") @DecimalMax("100.00")
    BigDecimal previousPercentage
) {}
