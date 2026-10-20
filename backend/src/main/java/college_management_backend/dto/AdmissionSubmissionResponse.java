
package college_management_backend.dto;

public record AdmissionSubmissionResponse(
    String applicationNumber,
    String status,
    String message
) {}
