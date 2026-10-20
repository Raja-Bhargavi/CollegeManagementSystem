
package college_management_backend.event;

public record StudentAdmissionApprovedEvent(
        Long userId,
        String email
) {}
