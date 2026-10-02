package college_management_backend.controller;

import college_management_backend.dto.StaffProfileUpdateRequest;
import college_management_backend.dto.StaffRequest;
import college_management_backend.dto.StaffResponse;
import college_management_backend.service.StaffService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

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

    // =========================================================
    // STAFF SELF PROFILE
    // =========================================================

    @GetMapping("/me")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<StaffResponse> getMyProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                staffService.getStaffByUsername(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<StaffResponse> updateMyProfile(
            @Valid @RequestBody StaffProfileUpdateRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                staffService.updateMyProfile(
                        authentication.getName(),
                        request
                )
        );
    }


    // =========================================================
    // STAFF LIST
    // =========================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')"
    )
    public ResponseEntity<List<StaffResponse>> getAllStaff() {

        return ResponseEntity.ok(
                staffService.getAllStaff()
        );
    }


    // =========================================================
    // STAFF BY ID
    // =========================================================

    @GetMapping("/{staffId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')"
    )
    public ResponseEntity<StaffResponse> getStaffById(
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                staffService.getStaffById(staffId)
        );
    }


    // =========================================================
    // STAFF BY USER ID
    // =========================================================

    @GetMapping("/user/{userId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')"
    )
    public ResponseEntity<StaffResponse> getStaffByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                staffService.getStaffByUserId(userId)
        );
    }


    // =========================================================
    // ADMIN - CREATE STAFF
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> createStaff(
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        staffService.createStaff(request)
                );
    }


    // =========================================================
    // ADMIN - UPDATE STAFF
    // =========================================================

    @PutMapping("/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable Long staffId,
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.updateStaff(
                        staffId,
                        request
                )
        );
    }


    // =========================================================
    // ADMIN - DELETE STAFF
    // =========================================================

    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStaff(
            @PathVariable Long staffId) {

        staffService.deleteStaff(staffId);

        return ResponseEntity
                .noContent()
                .build();
    }
}