package college_management_backend.controller;

import college_management_backend.dto.LoginRequest;
import college_management_backend.dto.LoginResponse;
import college_management_backend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(
            AuthenticationService authenticationService) {

        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authenticationService.login(request)
        );
    }
}