
package college_management_backend.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface AdmissionApplicationProjection {
    Long getAdmissionRequestId();
    String getApplicationNumber();
    String getFirstName();
    String getLastName();
    String getEmail();
    String getPhone();
    String getProgramName();
    String getDegreeType();
    String getDepartmentName();
    LocalDate getDateOfBirth();
    Integer getAdmissionYear();
    String getPreviousQualification();
    String getStatus();
    String getAdminRemarks();
    LocalDateTime getCreatedAt();
}
