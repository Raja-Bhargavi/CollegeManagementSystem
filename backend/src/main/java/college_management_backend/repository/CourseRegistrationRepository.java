package college_management_backend.repository;

import college_management_backend.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRegistrationRepository
        extends JpaRepository<CourseRegistration, Long> {

    boolean existsByStudentIdAndOfferingId(
            Long studentId,
            Long offeringId
    );
}