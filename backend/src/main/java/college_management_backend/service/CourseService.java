package college_management_backend.service;

import college_management_backend.dto.CourseRequest;
import college_management_backend.dto.CourseResponse;
import college_management_backend.entity.Course;
import college_management_backend.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(course -> new CourseResponse(
                        course.getCourseId(),
                        course.getCourseCode(),
                        course.getCourseName(),
                        course.getCredits(),
                        course.getDescription()
                ))
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );

        return toResponse(course);
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request) {

        if (courseRepository.existsByCourseCode(request.getCourseCode())) {
            throw new RuntimeException(
                    "Course with code "
                            + request.getCourseCode()
                            + " already exists"
            );
        }

        Course course = new Course();

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCredits(request.getCredits());
        course.setDescription(request.getDescription());

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
                        )
                );

        /*
         * Check whether the new course code belongs
         * to another course.
         */
        if (!course.getCourseCode().equals(request.getCourseCode())
                && courseRepository.existsByCourseCode(request.getCourseCode())) {

            throw new RuntimeException(
                    "Course with code "
                            + request.getCourseCode()
                            + " already exists"
            );
        }

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setCredits(request.getCredits());
        course.setDescription(request.getDescription());

        Course updatedCourse = courseRepository.save(course);

        return toResponse(updatedCourse);
    }

    @Transactional
    public void deleteCourse(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );

        courseRepository.delete(course);
    }

    private CourseResponse toResponse(Course course) {

        return new CourseResponse(
                course.getCourseId(),
                course.getCourseCode(),
                course.getCourseName(),
                course.getCredits(),
                course.getDescription()
        );
    }
}