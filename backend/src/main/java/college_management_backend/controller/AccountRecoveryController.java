
package college_management_backend.controller;

import college_management_backend.dto.EmailRequest;
import college_management_backend.dto.ResetPasswordRequest;
import college_management_backend.service.AccountRecoveryService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AccountRecoveryController {

    private final AccountRecoveryService recoveryService;

    public AccountRecoveryController(
            AccountRecoveryService recoveryService) {
        this.recoveryService = recoveryService;
    }

    @PostMapping("/forgot-username")
    public ResponseEntity<Map<String, String>> forgotUsername(
            @Valid @RequestBody EmailRequest request) {

        String message = recoveryService.forgotUsername(request);

        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody EmailRequest request) {

        String message = recoveryService.forgotPassword(request);

        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        recoveryService.resetPassword(request);

        return ResponseEntity.ok(
                Map.of("message", "Your password has been reset successfully.")
        );
    }
}
