package college_management_backend.repository;

import college_management_backend.entity.CourseOffering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseOfferingRepository
        extends JpaRepository<CourseOffering, Long> {
}