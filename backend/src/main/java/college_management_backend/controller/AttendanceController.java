package college_management_backend.controller;

import college_management_backend.dto.AttendanceRequest;
import college_management_backend.dto.AttendanceResponse;
import college_management_backend.dto.FacultyAttendanceResponse;
import college_management_backend.service.AttendanceService;
import college_management_backend.service.FacultyService;
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

    private final FacultyService facultyService;

    public AttendanceController(
            AttendanceService attendanceService,
            StudentService studentService,
            FacultyService facultyService) {

        this.attendanceService =
                attendanceService;

        this.studentService =
                studentService;

        this.facultyService =
                facultyService;
    }

    // =========================================================
    // ADMIN / STAFF / FACULTY - ALL ATTENDANCE
    // =========================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY')"
    )
    public List<AttendanceResponse>
    getAllAttendance() {

        return attendanceService
                .getAllAttendance();
    }

    // =========================================================
    // STUDENT - MY ATTENDANCE
    // =========================================================

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AttendanceResponse>
    getMyAttendance(
            Authentication authentication) {

        Long studentId =
                studentService
                        .getStudentByUsername(
                                authentication.getName()
                        )
                        .getStudentId();

        return attendanceService
                .getAttendanceByStudent(
                        studentId
                );
    }

    // =========================================================
    // FACULTY - MY ATTENDANCE
    // =========================================================

    @GetMapping("/faculty/me")
    @PreAuthorize("hasRole('FACULTY')")
    public List<FacultyAttendanceResponse>
    getMyFacultyAttendance(
            Authentication authentication) {

        Long facultyId =
                facultyService
                        .getFacultyByUsername(
                                authentication.getName()
                        )
                        .getFacultyId();

        return attendanceService
                .getAttendanceByFaculty(
                        facultyId
                );
    }

    // =========================================================
    // GET ATTENDANCE BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY')"
    )
    public AttendanceResponse
    getAttendanceById(
            @PathVariable Long id) {

        return attendanceService
                .getAttendanceById(id);
    }

    // =========================================================
    // GET BY REGISTRATION
    // =========================================================

    @GetMapping(
            "/registration/{registrationId}"
    )
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY')"
    )
    public List<AttendanceResponse>
    getAttendanceByRegistration(
            @PathVariable Long registrationId) {

        return attendanceService
                .getAttendanceByRegistration(
                        registrationId
                );
    }

    // =========================================================
    // MARK
    // =========================================================

    @PostMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY')"
    )
    public ResponseEntity<AttendanceResponse>
    markAttendance(
            @Valid
            @RequestBody AttendanceRequest request) {

        AttendanceResponse response =
                attendanceService
                        .markAttendance(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY')"
    )
    public AttendanceResponse
    updateAttendance(
            @PathVariable Long id,
            @Valid
            @RequestBody AttendanceRequest request) {

        return attendanceService
                .updateAttendance(
                        id,
                        request
                );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void>
    deleteAttendance(
            @PathVariable Long id) {

        attendanceService
                .deleteAttendance(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}