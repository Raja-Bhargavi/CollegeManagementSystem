package college_management_backend.controller;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.service.FacultyService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@SecurityRequirement(name = "bearerAuth")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    // =========================================================
    // FACULTY - GET OWN PROFILE
    // GET /api/faculty/me
    // =========================================================

    @GetMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyResponse> getMyProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                facultyService.getFacultyByUsername(
                        authentication.getName()
                )
        );
    }

    // =========================================================
    // FACULTY - UPDATE OWN PROFILE
    // PUT /api/faculty/me
    // =========================================================

    @PutMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyResponse> updateMyProfile(
            @Valid @RequestBody FacultyRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                facultyService.updateMyProfile(
                        authentication.getName(),
                        request
                )
        );
    }

    // =========================================================
    // GET ALL FACULTY
    // ADMIN / STAFF / MANAGEMENT
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public ResponseEntity<List<FacultyResponse>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    // =========================================================
    // GET FACULTY BY ID
    // ADMIN / STAFF / MANAGEMENT
    // =========================================================

    @GetMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public ResponseEntity<FacultyResponse> getFacultyById(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(facultyId)
        );
    }

    // =========================================================
    // CREATE FACULTY
    // ADMIN / STAFF
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FacultyResponse> createFaculty(
            @Valid @RequestBody FacultyRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        facultyService.createFaculty(request)
                );
    }

    // =========================================================
    // UPDATE FACULTY BY ID
    // ADMIN / STAFF
    // =========================================================

    @PutMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FacultyResponse> updateFaculty(
            @PathVariable Long facultyId,
            @Valid @RequestBody FacultyRequest request) {

        return ResponseEntity.ok(
                facultyService.updateFaculty(
                        facultyId,
                        request
                )
        );
    }

    // =========================================================
    // DELETE FACULTY
    // ADMIN / STAFF
    // =========================================================

    @DeleteMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable Long facultyId) {

        facultyService.deleteFaculty(facultyId);

        return ResponseEntity.noContent().build();
    }
}