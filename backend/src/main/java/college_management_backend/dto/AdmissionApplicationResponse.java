
package college_management_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdmissionApplicationResponse(
    Long admissionRequestId,
    String applicationNumber,
    String firstName,
    String lastName,
    String email,
    String phone,
    String programName,
    String degreeType,
    String departmentName,
    LocalDate dateOfBirth,
    Integer admissionYear,
    String previousQualification,
    String status,
    String adminRemarks,
    LocalDateTime createdAt
) {}
