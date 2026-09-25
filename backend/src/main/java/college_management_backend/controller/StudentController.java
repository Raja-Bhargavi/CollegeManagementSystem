package college_management_backend.controller;

import java.util.List;

import college_management_backend.dto.StudentRequest;
import college_management_backend.dto.StudentResponse;
import college_management_backend.service.StudentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ADMIN, STAFF, FACULTY, MANAGEMENT
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY','MANAGEMENT')")
    public List<StudentResponse> getAllStudents() {
        return studentService.getAllStudents();
    }

    // ADMIN, STAFF, FACULTY, MANAGEMENT
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY','MANAGEMENT')")
    public StudentResponse getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // STUDENT can retrieve their own profile
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public StudentResponse getMyProfile(Authentication authentication) {
        return studentService.getStudentByUsername(authentication.getName());
    }

    // ADMIN, STAFF
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<StudentResponse> createStudent(
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentService.createStudent(request));
    }

    // ADMIN, STAFF
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public StudentResponse updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        return studentService.updateStudent(id, request);
    }

    // ADMIN only
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentResponse deactivateStudent(@PathVariable Long id) {
        return studentService.deactivateStudent(id);
    }
}