
package college_management_backend.service;

import college_management_backend.dto.publicdto.PublicCourseResponse;
import college_management_backend.dto.publicdto.PublicDepartmentResponse;
import college_management_backend.dto.publicdto.PublicEventResponse;
import college_management_backend.dto.publicdto.PublicFacultyResponse;
import college_management_backend.dto.publicdto.PublicNoticeResponse;

import college_management_backend.entity.Notice;

import college_management_backend.repository.CourseRepository;
import college_management_backend.repository.DepartmentRepository;
import college_management_backend.repository.EventRepository;
import college_management_backend.repository.FacultyRepository;
import college_management_backend.repository.NoticeRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class PublicService {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;
    private final NoticeRepository noticeRepository;
    private final EventRepository eventRepository;

    public PublicService(
            DepartmentRepository departmentRepository,
            CourseRepository courseRepository,
            FacultyRepository facultyRepository,
            NoticeRepository noticeRepository,
            EventRepository eventRepository) {

        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
        this.noticeRepository = noticeRepository;
        this.eventRepository = eventRepository;
    }

    // PUBLIC DEPARTMENTS

    public List<PublicDepartmentResponse> getPublicDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(PublicDepartmentResponse::new)
                .toList();
    }

    // PUBLIC DEPARTMENT BY ID

    public PublicDepartmentResponse getPublicDepartmentById(
            Long departmentId) {

        return departmentRepository.findById(departmentId)
                .map(PublicDepartmentResponse::new)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found with ID: "
                                        + departmentId
                        )
                );
    }

    // PUBLIC DEPARTMENT COURSES

    public List<PublicCourseResponse> getPublicDepartmentCourses(
            Long departmentId) {

        return courseRepository.findByDepartmentId(departmentId)
                .stream()
                .filter(course ->
                        course.getProgramLevel() != null
                                &&
                        (
                                "BTECH".equalsIgnoreCase(
                                        course.getProgramLevel()
                                )
                                ||
                                "MTECH".equalsIgnoreCase(
                                        course.getProgramLevel()
                                )
                        )
                )
                .map(PublicCourseResponse::new)
                .toList();
    }

    // PUBLIC DEPARTMENT COURSES BY PROGRAM

    public List<PublicCourseResponse> getPublicDepartmentCoursesByProgram(
            Long departmentId,
            String program) {

        String normalizedProgram = program.trim().toUpperCase();

        if (!"BTECH".equals(normalizedProgram)
                && !"MTECH".equals(normalizedProgram)) {
            return List.of();
        }

        return courseRepository
                .findByDepartmentIdAndProgramLevelIgnoreCase(
                        departmentId,
                        normalizedProgram
                )
                .stream()
                .map(PublicCourseResponse::new)
                .toList();
    }

    // PUBLIC COURSE BY ID

    public PublicCourseResponse getPublicCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .map(PublicCourseResponse::new)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );
    }

    // ALL PUBLIC COURSES
    // Return all existing courses; do not hide records because their
    // department or program assignment has not been configured yet.

    public List<PublicCourseResponse> getPublicCourses() {
        return courseRepository.findAll()
                .stream()
                .map(PublicCourseResponse::new)
                .toList();
    }

    // PUBLIC FACULTY

    public List<PublicFacultyResponse> getPublicFaculty() {
        return facultyRepository.findAll()
                .stream()
                .filter(faculty ->
                        faculty.getFacultyStatus() != null
                                &&
                        "ACTIVE".equalsIgnoreCase(
                                faculty.getFacultyStatus()
                        )
                )
                .map(PublicFacultyResponse::new)
                .toList();
    }

    // PUBLIC DEPARTMENT FACULTY

    public List<PublicFacultyResponse> getPublicDepartmentFaculty(
            Long departmentId) {

        return facultyRepository.findByDepartmentId(departmentId)
                .stream()
                .filter(faculty ->
                        faculty.getFacultyStatus() != null
                                &&
                        "ACTIVE".equalsIgnoreCase(
                                faculty.getFacultyStatus()
                        )
                )
                .map(PublicFacultyResponse::new)
                .toList();
    }

    // PUBLIC NOTICES

    public List<PublicNoticeResponse> getPublicNotices() {
        LocalDateTime now = LocalDateTime.now();

        return noticeRepository
                .findByVisibilityAndStatus("ALL", "PUBLISHED")
                .stream()
                .filter(notice -> {
                    if (notice.getPublishedAt() != null
                            && notice.getPublishedAt().isAfter(now)) {
                        return false;
                    }

                    if (notice.getExpiryDate() != null
                            && notice.getExpiryDate().isBefore(now)) {
                        return false;
                    }

                    return true;
                })
                .sorted(
                        Comparator.comparing(
                                Notice::getPublishedAt,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .map(PublicNoticeResponse::new)
                .toList();
    }

    // PUBLIC EVENTS

    public List<PublicEventResponse> getPublicEvents() {
        LocalDateTime now = LocalDateTime.now();

        return eventRepository.findAllByOrderByEventDateAsc()
                .stream()
                .filter(event ->
                        event.getEventDate() != null
                                && event.getEventDate().isAfter(now)
                )
                .filter(event ->
                        event.getStatus() != null
                                &&
                        (
                                "PUBLISHED".equalsIgnoreCase(
                                        event.getStatus()
                                )
                                ||
                                "ACTIVE".equalsIgnoreCase(
                                        event.getStatus()
                                )
                        )
                )
                .map(PublicEventResponse::new)
                .toList();
    }
}
