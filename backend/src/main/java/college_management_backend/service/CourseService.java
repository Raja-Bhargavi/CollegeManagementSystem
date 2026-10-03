package college_management_backend.service;

import college_management_backend.dto.CourseRequest;
import college_management_backend.dto.CourseResponse;
import college_management_backend.entity.Course;
import college_management_backend.repository.CourseRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CourseResponse getCourseById(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        ));

        return toResponse(course);
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request) {

        String courseCode = request.getCourseCode().trim();
        String courseName = request.getCourseName().trim();

        if (courseRepository.existsByCourseCode(courseCode)) {
            throw new RuntimeException(
                    "Course with code " + courseCode + " already exists"
            );
        }

        if (courseRepository.existsByCourseName(courseName)) {
            throw new RuntimeException(
                    "Course with name " + courseName + " already exists"
            );
        }

        Course course = new Course();

        course.setCourseCode(courseCode);
        course.setCourseName(courseName);

        // Credits
        course.setCredits(request.getCredits());

        // Description
        course.setDescription(
                request.getDescription() == null
                        ? null
                        : request.getDescription().trim()
        );

        // Department
        course.setDepartmentId(request.getDepartmentId());

        // Program level
        course.setProgramLevel(
                request.getProgramLevel() == null
                        ? null
                        : request.getProgramLevel().trim().toUpperCase()
        );

        Course savedCourse = courseRepository.save(course);

        return toResponse(savedCourse);
    }

    @Transactional
    public CourseResponse updateCourse(
            Long courseId,
            CourseRequest request) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        ));

        String courseCode = request.getCourseCode().trim();
        String courseName = request.getCourseName().trim();

        if (!course.getCourseCode().equals(courseCode)
                && courseRepository.existsByCourseCode(courseCode)) {

            throw new RuntimeException(
                    "Course with code " + courseCode + " already exists"
            );
        }

        if (!course.getCourseName().equals(courseName)
                && courseRepository.existsByCourseName(courseName)) {

            throw new RuntimeException(
                    "Course with name " + courseName + " already exists"
            );
        }

        course.setCourseCode(courseCode);
        course.setCourseName(courseName);

        // Credits
        course.setCredits(request.getCredits());

        // Description
        course.setDescription(
                request.getDescription() == null
                        ? null
                        : request.getDescription().trim()
        );

        // Department
        course.setDepartmentId(request.getDepartmentId());

        // Program level
        course.setProgramLevel(
                request.getProgramLevel() == null
                        ? null
                        : request.getProgramLevel().trim().toUpperCase()
        );

        Course updatedCourse = courseRepository.save(course);

        return toResponse(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        ));

        courseRepository.delete(course);
    }

    private CourseResponse toResponse(Course course) {

        return new CourseResponse(
                course.getCourseId(),
                course.getCourseCode(),
                course.getCourseName(),
                course.getCredits(),
                course.getDescription(),
                course.getDepartmentId(),
                course.getProgramLevel()
        );
    }
}