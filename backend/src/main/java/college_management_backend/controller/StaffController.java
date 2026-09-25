package college_management_backend.controller;

import college_management_backend.dto.StaffRequest;
import college_management_backend.dto.StaffResponse;
import college_management_backend.service.StaffService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@SecurityRequirement(name = "bearerAuth")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<List<StaffResponse>> getAllStaff() {

        return ResponseEntity.ok(
                staffService.getAllStaff()
        );
    }

    @GetMapping("/{staffId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<StaffResponse> getStaffById(
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                staffService.getStaffById(staffId)
        );
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<StaffResponse> getStaffByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                staffService.getStaffByUserId(userId)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> createStaff(
            @RequestBody StaffRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(staffService.createStaff(request));
    }

    @PutMapping("/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable Long staffId,
            @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.updateStaff(staffId, request)
        );
    }

    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStaff(
            @PathVariable Long staffId) {

        staffService.deleteStaff(staffId);

        return ResponseEntity.noContent().build();
    }
}