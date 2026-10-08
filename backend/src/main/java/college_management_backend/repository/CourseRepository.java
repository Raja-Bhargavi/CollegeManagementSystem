package college_management_backend.repository;

import college_management_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCourseCode(String courseCode);

    Optional<Course> findByCourseName(String courseName);

    boolean existsByCourseCode(String courseCode);

    boolean existsByCourseName(String courseName);

    List<Course> findByDepartmentId(Long departmentId);

    List<Course> findByDepartmentIdAndProgramLevel(
            Long departmentId,
            String programLevel
    );
}