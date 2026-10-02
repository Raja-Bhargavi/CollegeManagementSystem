package college_management_backend.controller;

import college_management_backend.dto.CourseRegistrationRequest;
import college_management_backend.dto.CourseRegistrationResponse;
import college_management_backend.service.CourseRegistrationService;
import college_management_backend.service.StudentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;
import college_management_backend.service.FacultyService;

import java.util.List;

@RestController
@RequestMapping("/api/course-registrations")
@SecurityRequirement(name = "bearerAuth")
public class CourseRegistrationController {

    private final CourseRegistrationService
            courseRegistrationService;

    private final StudentService studentService;
    private final FacultyService facultyService;
    

    public CourseRegistrationController(
        CourseRegistrationService courseRegistrationService,
        StudentService studentService,
        FacultyService facultyService) {

        this.courseRegistrationService =
                courseRegistrationService;

        this.studentService =
                studentService;

        this.facultyService =
                facultyService;
        }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<CourseRegistrationResponse> getAllRegistrations() {

        return courseRegistrationService.getAllRegistrations();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<CourseRegistrationResponse> getMyRegistrations(
            Authentication authentication) {

        Long studentId =
                studentService
                        .getStudentByUsername(authentication.getName())
                        .getStudentId();

        return courseRegistrationService
                .getRegistrationsByStudent(studentId);
    }

        // =========================================================
        // FACULTY - MY REGISTERED STUDENTS
        // =========================================================

        @GetMapping("/faculty/me")
        @PreAuthorize("hasRole('FACULTY')")
        public List<CourseRegistrationResponse>
        getMyFacultyRegistrations(
                Authentication authentication) {

        Long facultyId =
                facultyService
                        .getFacultyByUsername(
                                authentication.getName()
                        )
                        .getFacultyId();

        return courseRegistrationService
                .getRegistrationsByFaculty(facultyId);
        }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public CourseRegistrationResponse getRegistrationById(
            @PathVariable Long id) {

        return courseRegistrationService
                .getRegistrationById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseRegistrationResponse>
    registerStudent(
            @Valid @RequestBody CourseRegistrationRequest request) {

        CourseRegistrationResponse response =
                courseRegistrationService
                        .registerStudent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CourseRegistrationResponse updateRegistration(
            @PathVariable Long id,
            @Valid @RequestBody CourseRegistrationRequest request) {

        return courseRegistrationService
                .updateRegistration(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRegistration(
            @PathVariable Long id) {

        courseRegistrationService
                .deleteRegistration(id);

        return ResponseEntity.noContent().build();
    }
}