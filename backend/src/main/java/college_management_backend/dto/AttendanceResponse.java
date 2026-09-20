package college_management_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceResponse {

    private Long attendanceId;
    private Long registrationId;
    private LocalDate attendanceDate;
    private String status;
    private Long markedBy;
    private LocalDateTime markedAt;

    public AttendanceResponse(
            Long attendanceId,
            Long registrationId,
            LocalDate attendanceDate,
            String status,
            Long markedBy,
            LocalDateTime markedAt) {

        this.attendanceId = attendanceId;
        this.registrationId = registrationId;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.markedBy = markedBy;
        this.markedAt = markedAt;
    }

    public Long getAttendanceId() {
        return attendanceId;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public String getStatus() {
        return status;
    }

    public Long getMarkedBy() {
        return markedBy;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }
}
