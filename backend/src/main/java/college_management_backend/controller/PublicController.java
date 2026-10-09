package college_management_backend.controller;

import college_management_backend.dto.publicdto.PublicCourseResponse;
import college_management_backend.dto.publicdto.PublicDepartmentResponse;
import college_management_backend.dto.publicdto.PublicEventResponse;
import college_management_backend.dto.publicdto.PublicFacultyResponse;
import college_management_backend.dto.publicdto.PublicNoticeResponse;
import college_management_backend.service.PublicService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    // =========================================================
    // DEPARTMENTS
    // =========================================================

    @GetMapping("/departments")
    public ResponseEntity<List<PublicDepartmentResponse>>
    getPublicDepartments() {

        return ResponseEntity.ok(
                publicService.getPublicDepartments()
        );
    }

    @GetMapping("/departments/{departmentId}")
    public ResponseEntity<PublicDepartmentResponse>
    getPublicDepartmentById(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                publicService.getPublicDepartmentById(
                        departmentId
                )
        );
    }

    /*
     * Department courses.
     *
     * Without program:
     *
     * /api/public/departments/1/courses
     *
     * With program:
     *
     * /api/public/departments/1/courses?program=BTECH
     *
     * /api/public/departments/1/courses?program=MTECH
     */
    @GetMapping("/departments/{departmentId}/courses")
    public ResponseEntity<List<PublicCourseResponse>>
    getPublicDepartmentCourses(
            @PathVariable Long departmentId,
            @RequestParam(required = false) String program) {

        if (program == null || program.isBlank()) {

            return ResponseEntity.ok(
                    publicService.getPublicDepartmentCourses(
                            departmentId
                    )
            );
        }

        return ResponseEntity.ok(
                publicService.getPublicDepartmentCoursesByProgram(
                        departmentId,
                        program
                )
        );
    }

    @GetMapping("/departments/{departmentId}/faculty")
    public ResponseEntity<List<PublicFacultyResponse>>
    getPublicDepartmentFaculty(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                publicService.getPublicDepartmentFaculty(
                        departmentId
                )
        );
    }

    // =========================================================
    // COURSES
    // =========================================================

    @GetMapping("/courses")
    public ResponseEntity<List<PublicCourseResponse>>
    getPublicCourses() {

        return ResponseEntity.ok(
                publicService.getPublicCourses()
        );
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<PublicCourseResponse>
    getPublicCourseById(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                publicService.getPublicCourseById(courseId)
        );
    }

    // =========================================================
    // FACULTY
    // =========================================================

    @GetMapping("/faculty")
    public ResponseEntity<List<PublicFacultyResponse>>
    getPublicFaculty() {

        return ResponseEntity.ok(
                publicService.getPublicFaculty()
        );
    }

    // =========================================================
    // NOTICES
    // =========================================================

    @GetMapping("/notices")
    public ResponseEntity<List<PublicNoticeResponse>>
    getPublicNotices() {

        return ResponseEntity.ok(
                publicService.getPublicNotices()
        );
    }

    // =========================================================
    // EVENTS
    // =========================================================

    @GetMapping("/events")
    public ResponseEntity<List<PublicEventResponse>>
    getPublicEvents() {

        return ResponseEntity.ok(
                publicService.getPublicEvents()
        );
    }
}