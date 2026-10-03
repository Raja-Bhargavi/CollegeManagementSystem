package college_management_backend.controller;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.service.FacultyService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    /*
     * MANAGEMENT is allowed to VIEW faculty.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public ResponseEntity<List<FacultyResponse>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    /*
     * MANAGEMENT is allowed to VIEW a particular faculty member.
     */
    @GetMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public ResponseEntity<FacultyResponse> getFacultyById(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(facultyId)
        );
    }

    /*
     * Creating faculty remains restricted.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FacultyResponse> createFaculty(
            @Valid @RequestBody FacultyRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(facultyService.createFaculty(request));
    }

    /*
     * Updating faculty remains restricted.
     */
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

    /*
     * Deleting faculty remains restricted.
     */
    @DeleteMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable Long facultyId) {

        facultyService.deleteFaculty(facultyId);

        return ResponseEntity.noContent().build();
    }
}