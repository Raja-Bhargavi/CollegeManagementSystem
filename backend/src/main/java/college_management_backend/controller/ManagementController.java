package college_management_backend.controller;

import college_management_backend.dto.ManagementProfileUpdateRequest;
import college_management_backend.dto.ManagementResponse;
import college_management_backend.entity.User;
import college_management_backend.repository.UserRepository;
import college_management_backend.service.ManagementService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/management")
@SecurityRequirement(name = "bearerAuth")
public class ManagementController {

    private final ManagementService managementService;
    private final UserRepository userRepository;

    public ManagementController(
            ManagementService managementService,
            UserRepository userRepository) {

        this.managementService = managementService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET MY MANAGEMENT PROFILE
    // =========================================================

    @GetMapping("/me")
    @PreAuthorize("hasRole('MANAGEMENT')")
    public ResponseEntity<ManagementResponse>
    getMyProfile(
            Authentication authentication) {

        User user =
                userRepository
                        .findByUsername(
                                authentication.getName()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                                + authentication.getName()
                                )
                        );

        return ResponseEntity.ok(
                managementService.getMyProfile(
                        user.getUserId()
                )
        );
    }

    // =========================================================
    // UPDATE MY MANAGEMENT PROFILE
    // =========================================================

    @PutMapping("/me")
    @PreAuthorize("hasRole('MANAGEMENT')")
    public ResponseEntity<ManagementResponse>
    updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody
                    ManagementProfileUpdateRequest request) {

        User user =
                userRepository
                        .findByUsername(
                                authentication.getName()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                                + authentication.getName()
                                )
                        );

        return ResponseEntity.ok(
                managementService.updateMyProfile(
                        user.getUserId(),
                        request
                )
        );
    }
}