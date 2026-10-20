
package college_management_backend.dto;

import java.math.BigDecimal;

public record ProgramOptionResponse(
    Long programId,
    String programCode,
    String programName,
    String degreeType,
    BigDecimal durationYears,
    String departmentName
) {}
