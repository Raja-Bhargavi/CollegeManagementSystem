
package college_management_backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;

    @Column(name = "program_code", nullable = false, unique = true)
    private String programCode;

    @Column(name = "program_name", nullable = false)
    private String programName;

    @Column(name = "degree_type", nullable = false)
    private String degreeType;

    @Column(name = "duration_years", nullable = false)
    private BigDecimal durationYears;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    public Long getProgramId() {
        return programId;
    }

    public String getProgramCode() {
        return programCode;
    }

    public String getProgramName() {
        return programName;
    }

    public String getDegreeType() {
        return degreeType;
    }

    public BigDecimal getDurationYears() {
        return durationYears;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public void setProgramCode(String programCode) {
        this.programCode = programCode;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public void setDegreeType(String degreeType) {
        this.degreeType = degreeType;
    }

    public void setDurationYears(BigDecimal durationYears) {
        this.durationYears = durationYears;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}
