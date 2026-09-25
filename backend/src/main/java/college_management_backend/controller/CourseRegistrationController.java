package college_management_backend.controller;

import college_management_backend.dto.CourseRegistrationRequest;
import college_management_backend.dto.CourseRegistrationResponse;
import college_management_backend.service.CourseRegistrationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-registrations")
@SecurityRequirement(name = "bearerAuth")
public class CourseRegistrationController {

    private final CourseRegistrationService
            courseRegistrationService;

    public CourseRegistrationController(
            CourseRegistrationService courseRegistrationService) {

        this.courseRegistrationService =
                courseRegistrationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<CourseRegistrationResponse> getAllRegistrations() {

        return courseRegistrationService.getAllRegistrations();
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