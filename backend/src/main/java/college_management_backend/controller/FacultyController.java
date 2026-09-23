package college_management_backend.controller;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.service.FacultyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<List<FacultyResponse>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    @GetMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<FacultyResponse> getFacultyById(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(facultyId)
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<FacultyResponse> getFacultyByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                facultyService.getFacultyByUserId(userId)
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FacultyResponse> createFaculty(
            @RequestBody FacultyRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(facultyService.createFaculty(request));
    }

    @PutMapping("/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FacultyResponse> updateFaculty(
            @PathVariable Long facultyId,
            @RequestBody FacultyRequest request) {

        return ResponseEntity.ok(
                facultyService.updateFaculty(facultyId, request)
        );
    }

    @DeleteMapping("/{facultyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFaculty(
            @PathVariable Long facultyId) {

        facultyService.deleteFaculty(facultyId);

        return ResponseEntity.noContent().build();
    }
}