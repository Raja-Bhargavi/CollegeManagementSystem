
package college_management_backend.repository;

import college_management_backend.entity.AdmissionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdmissionRequestRepository
        extends JpaRepository<AdmissionRequest, Long> {

    boolean existsByEmailIgnoreCaseAndStatus(
            String email,
            String status
    );

    List<AdmissionRequest> findByStatusOrderByCreatedAtDesc(
            String status
    );

    @Query(value = """
        SELECT
            a.admission_request_id AS admissionRequestId,
            a.application_number AS applicationNumber,
            a.first_name AS firstName,
            a.last_name AS lastName,
            a.email AS email,
            a.phone AS phone,
            p.program_name AS programName,
            p.degree_type AS degreeType,
            d.department_name AS departmentName,
            a.date_of_birth AS dateOfBirth,
            a.admission_year AS admissionYear,
            a.previous_qualification AS previousQualification,
            a.status AS status,
            a.admin_remarks AS adminRemarks,
            a.created_at AS createdAt
        FROM admission_requests a
        JOIN programs p ON p.program_id = a.program_id
        JOIN departments d ON d.department_id = p.department_id
        WHERE a.status = :status
        ORDER BY a.created_at DESC
        """, nativeQuery = true)
    List<AdmissionApplicationProjection> findApplicationsByStatus(
            @Param("status") String status
    );

    @Query(value = """
        SELECT
            a.admission_request_id AS admissionRequestId,
            a.application_number AS applicationNumber,
            a.first_name AS firstName,
            a.last_name AS lastName,
            a.email AS email,
            a.phone AS phone,
            p.program_name AS programName,
            p.degree_type AS degreeType,
            d.department_name AS departmentName,
            a.date_of_birth AS dateOfBirth,
            a.admission_year AS admissionYear,
            a.previous_qualification AS previousQualification,
            a.status AS status,
            a.admin_remarks AS adminRemarks,
            a.created_at AS createdAt
        FROM admission_requests a
        JOIN programs p ON p.program_id = a.program_id
        JOIN departments d ON d.department_id = p.department_id
        WHERE a.admission_request_id = :id
        """, nativeQuery = true)
    Optional<AdmissionApplicationProjection> findApplicationDetailsById(
            @Param("id") Long id
    );
}
