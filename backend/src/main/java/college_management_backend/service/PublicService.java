
package college_management_backend.service;

import college_management_backend.dto.publicdto.PublicCourseResponse;
import college_management_backend.dto.publicdto.PublicDepartmentResponse;
import college_management_backend.dto.publicdto.PublicEventResponse;
import college_management_backend.dto.publicdto.PublicFacultyResponse;
import college_management_backend.dto.publicdto.PublicNoticeResponse;

import college_management_backend.entity.Event;
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

    public List<PublicDepartmentResponse> getPublicDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(PublicDepartmentResponse::new)
                .toList();
    }

    public PublicDepartmentResponse getPublicDepartmentById(
            Long departmentId) {

        return departmentRepository.findById(departmentId)
                .map(PublicDepartmentResponse::new)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found with ID: " + departmentId
                ));
    }

    public List<PublicCourseResponse> getPublicDepartmentCourses(
            Long departmentId) {

        return courseRepository.findByDepartmentId(departmentId)
                .stream()
                .filter(course ->
                        course.getProgramLevel() != null
                                && (
                                "BTECH".equalsIgnoreCase(
                                        course.getProgramLevel()
                                )
                                || "MTECH".equalsIgnoreCase(
                                        course.getProgramLevel()
                                )
                        )
                )
                .map(PublicCourseResponse::new)
                .toList();
    }

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
                        departmentId, normalizedProgram
                )
                .stream()
                .map(PublicCourseResponse::new)
                .toList();
    }

    public PublicCourseResponse getPublicCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .map(PublicCourseResponse::new)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found with ID: " + courseId
                ));
    }

    public List<PublicCourseResponse> getPublicCourses() {
        return courseRepository.findAll()
                .stream()
                .map(PublicCourseResponse::new)
                .toList();
    }

    public List<PublicFacultyResponse> getPublicFaculty() {
        return facultyRepository.findAll()
                .stream()
                .filter(faculty ->
                        faculty.getFacultyStatus() != null
                                && "ACTIVE".equalsIgnoreCase(
                                        faculty.getFacultyStatus()
                                )
                )
                .map(PublicFacultyResponse::new)
                .toList();
    }

    public PublicFacultyResponse getPublicFacultyById(Long facultyId) {
        return facultyRepository.findById(facultyId)
                .filter(faculty ->
                        faculty.getFacultyStatus() != null
                                && "ACTIVE".equalsIgnoreCase(
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

    public List<PublicFacultyResponse> getPublicDepartmentFaculty(
            Long departmentId) {

        return facultyRepository.findByDepartmentId(departmentId)
                .stream()
                .filter(faculty ->
                        faculty.getFacultyStatus() != null
                                && "ACTIVE".equalsIgnoreCase(
                                        faculty.getFacultyStatus()
                                )
                )
                .map(PublicFacultyResponse::new)
                .toList();
    }

    // Only ALL + PUBLISHED notices are publicly visible.
    // Student-targeted notices are intentionally excluded.
    public List<PublicNoticeResponse> getPublicNotices() {
        LocalDateTime now = LocalDateTime.now();

        return noticeRepository
                .findByVisibilityAndStatus("ALL", "PUBLISHED")
                .stream()
                .filter(notice -> isNoticeCurrentlyPublic(notice, now))
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

    public List<PublicNoticeResponse> getPublicDepartmentNotices(
        Long departmentId) {

    if (!departmentRepository.existsById(departmentId)) {
        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Department not found with ID: " + departmentId
        );
    }

    LocalDateTime now = LocalDateTime.now();

    return noticeRepository
            .findByVisibilityAndStatus("ALL", "PUBLISHED")
            .stream()
            .filter(notice -> {
                String scope = notice.getDepartmentScope();

                // Legacy records may have no department scope configured.
                if (scope == null || scope.isBlank()) {
                    return notice.getDepartmentId() == null
                            || notice.getDepartmentId().equals(departmentId);
                }

                if ("SELECTED".equalsIgnoreCase(scope)) {
                    return notice.getTargetDepartmentIds() != null
                            && notice.getTargetDepartmentIds()
                                    .contains(departmentId);
                }

                // For new ALL-department notices, departmentId should be null.
                // A legacy record with a departmentId remains department-specific.
                return notice.getDepartmentId() == null
                        || notice.getDepartmentId().equals(departmentId);
            })
            .filter(notice ->
                    notice.getPublishedAt() == null
                            || !notice.getPublishedAt().isAfter(now)
            )
            .filter(notice ->
                    notice.getExpiryDate() == null
                            || !notice.getExpiryDate().isBefore(now)
            )
            .sorted(
                    java.util.Comparator.comparing(
                            Notice::getPublishedAt,
                            java.util.Comparator.nullsLast(
                                    java.util.Comparator.reverseOrder()
                            )
                    )
            )
            .map(PublicNoticeResponse::new)
            .toList();
}

    private boolean isNoticeCurrentlyPublic(
            Notice notice,
            LocalDateTime now) {

        return (notice.getPublishedAt() == null
                || !notice.getPublishedAt().isAfter(now))
                && (notice.getExpiryDate() == null
                || !notice.getExpiryDate().isBefore(now));
    }

    public List<PublicEventResponse> getPublicEvents() {
        LocalDateTime now = LocalDateTime.now();

        return eventRepository.findAllByOrderByEventDateAsc()
                .stream()
                .filter(event -> isPublicUpcomingEvent(event, now))
                .map(PublicEventResponse::new)
                .toList();
    }

    public List<PublicEventResponse> getPublicDepartmentEvents(
            Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Department not found with ID: " + departmentId
            );
        }

        LocalDateTime now = LocalDateTime.now();

        return eventRepository
                .findByDepartmentIdOrderByEventDateAsc(departmentId)
                .stream()
                .filter(event -> isPublicUpcomingEvent(event, now))
                .map(PublicEventResponse::new)
                .toList();
    }

    private boolean isPublicUpcomingEvent(
            Event event,
            LocalDateTime now) {

        return event.getEventDate() != null
                && event.getEventDate().isAfter(now)
                && event.getStatus() != null
                && PUBLIC_EVENT_STATUSES.contains(
                        event.getStatus().trim().toUpperCase()
                );
    }
}
