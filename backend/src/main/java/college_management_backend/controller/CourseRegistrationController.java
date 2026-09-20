package college_management_backend.controller;

import college_management_backend.dto.CourseRegistrationRequest;
import college_management_backend.dto.CourseRegistrationResponse;
import college_management_backend.service.CourseRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-registrations")
public class CourseRegistrationController {

    private final CourseRegistrationService
            courseRegistrationService;

    public CourseRegistrationController(
            CourseRegistrationService courseRegistrationService) {

        this.courseRegistrationService =
                courseRegistrationService;
    }

    @GetMapping
    public List<CourseRegistrationResponse> getAllRegistrations() {

        return courseRegistrationService.getAllRegistrations();
    }

    @GetMapping("/{id}")
    public CourseRegistrationResponse getRegistrationById(
            @PathVariable Long id) {

        return courseRegistrationService
                .getRegistrationById(id);
    }

    @PostMapping
    public ResponseEntity<CourseRegistrationResponse>
    registerStudent(
            @Valid @RequestBody
            CourseRegistrationRequest request) {

        CourseRegistrationResponse response =
                courseRegistrationService
                        .registerStudent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}