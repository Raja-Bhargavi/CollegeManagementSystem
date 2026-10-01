package college_management_backend.repository;

import college_management_backend.entity.CourseOffering;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseOfferingRepository
        extends JpaRepository<CourseOffering, Long> {

    boolean existsByCourseIdAndSectionIdAndFacultyId(
            Long courseId,
            Long sectionId,
            Long facultyId
    );

    Optional<CourseOffering>
    findByCourseIdAndSectionIdAndFacultyId(
            Long courseId,
            Long sectionId,
            Long facultyId
    );

    List<CourseOffering> findByFacultyId(
            Long facultyId
    );
}