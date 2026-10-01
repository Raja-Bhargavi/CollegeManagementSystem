package college_management_backend.repository;

import college_management_backend.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRegistrationRepository
        extends JpaRepository<CourseRegistration, Long> {

    boolean existsByStudentIdAndOfferingId(
            Long studentId,
            Long offeringId
    );

    Optional<CourseRegistration> findByStudentIdAndOfferingId(
            Long studentId,
            Long offeringId
    );

    List<CourseRegistration> findByStudentId(Long studentId);
}