package college_management_backend.controller;

import college_management_backend.dto.AttendanceRequest;
import college_management_backend.dto.AttendanceResponse;
import college_management_backend.service.AttendanceService;
import college_management_backend.service.StudentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@SecurityRequirement(name = "bearerAuth")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final StudentService studentService;

    public AttendanceController(
            AttendanceService attendanceService,
            StudentService studentService) {

        this.attendanceService = attendanceService;
        this.studentService = studentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<AttendanceResponse> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AttendanceResponse> getMyAttendance(
            Authentication authentication) {

        Long studentId =
                studentService
                        .getStudentByUsername(authentication.getName())
                        .getStudentId();

        return attendanceService
                .getAttendanceByStudent(studentId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public AttendanceResponse getAttendanceById(
            @PathVariable Long id) {

        return attendanceService.getAttendanceById(id);
    }

    @GetMapping("/registration/{registrationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<AttendanceResponse> getAttendanceByRegistration(
            @PathVariable Long registrationId) {

        return attendanceService
                .getAttendanceByRegistration(registrationId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @Valid @RequestBody AttendanceRequest request) {

        AttendanceResponse response =
                attendanceService.markAttendance(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public AttendanceResponse updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {

        return attendanceService.updateAttendance(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }
}