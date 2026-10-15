
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

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class PublicService {

    private static final Set<String> PUBLIC_EVENT_STATUSES =
            Set.of("PUBLISHED", "ACTIVE", "UPCOMING", "SCHEDULED");

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
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found with ID: " + departmentId
                ));
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
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found with ID: " + courseId
                ));
    }

    // ALL PUBLIC COURSES

    public List<PublicCourseResponse> getPublicCourses() {
        return courseRepository.findAll()
                .stream()
                .map(PublicCourseResponse::new)
                .toList();
    }

    // ALL ACTIVE PUBLIC FACULTY

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

    // PUBLIC FACULTY BY ID

    public PublicFacultyResponse getPublicFacultyById(
            Long facultyId) {

        return facultyRepository.findById(facultyId)
                .filter(faculty ->
                        faculty.getFacultyStatus() != null
                                &&
                        "ACTIVE".equalsIgnoreCase(
                                faculty.getFacultyStatus()
                        )
                )
                .map(PublicFacultyResponse::new)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Active faculty member not found with ID: "
                                + facultyId
                ));
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
                .filter(notice ->
                        notice.getPublishedAt() == null
                                || !notice.getPublishedAt().isAfter(now)
                )
                .filter(notice ->
                        notice.getExpiryDate() == null
                                || !notice.getExpiryDate().isBefore(now)
                )
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
                                && PUBLIC_EVENT_STATUSES.contains(
                                        event.getStatus()
                                                .trim()
                                                .toUpperCase()
                                )
                )
                .map(PublicEventResponse::new)
                .toList();
    }
}
