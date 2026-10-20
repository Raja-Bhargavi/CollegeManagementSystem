
package college_management_backend.repository;

import college_management_backend.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    @Query(value = """
        SELECT
            p.program_id AS programId,
            p.program_code AS programCode,
            p.program_name AS programName,
            p.degree_type AS degreeType,
            p.duration_years AS durationYears,
            d.department_name AS departmentName
        FROM programs p
        JOIN departments d
            ON d.department_id = p.department_id
        ORDER BY p.program_name
        """, nativeQuery = true)
    List<ProgramOptionProjection> findProgramOptions();

    interface ProgramOptionProjection {
        Long getProgramId();
        String getProgramCode();
        String getProgramName();
        String getDegreeType();
        java.math.BigDecimal getDurationYears();
        String getDepartmentName();
    }
}
