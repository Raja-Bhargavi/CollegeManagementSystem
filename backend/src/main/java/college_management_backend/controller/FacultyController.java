package college_management_backend.controller;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.service.FacultyService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

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
    // FACULTY - MY PROFILE
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
    // FACULTY - UPDATE MY PROFILE
    // =========================================================

    @PutMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyResponse> updateMyProfile(
            @RequestBody FacultyRequest request,
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
    // =========================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')"
    )
    public ResponseEntity<List<FacultyResponse>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    // =========================================================
    // GET FACULTY BY ID
    // =========================================================

    @GetMapping("/{facultyId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')"
    )
    public ResponseEntity<FacultyResponse> getFacultyById(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(facultyId)
        );
    }

    // =========================================================
    // GET FACULTY BY USER ID
    // =========================================================

    @GetMapping("/user/{userId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')"
    )
    public ResponseEntity<FacultyResponse> getFacultyByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                facultyService.getFacultyByUserId(userId)
        );
    }

    // =========================================================
    // CREATE
    // ADMIN ONLY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyResponse> createFaculty(
            @RequestBody FacultyRequest request) {

        return ResponseEntity.ok(
                facultyService.createFaculty(request)
        );
    }

    // =========================================================
    // FULL UPDATE
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{facultyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyResponse> updateFaculty(
            @PathVariable Long facultyId,
            @RequestBody FacultyRequest request) {

        return ResponseEntity.ok(
                facultyService.updateFaculty(
                        facultyId,
                        request
                )
        );
    }

    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{facultyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable Long facultyId) {

        facultyService.deleteFaculty(facultyId);

        return ResponseEntity.noContent().build();
    }
}