package college_management_backend.controller;

import college_management_backend.entity.User;
import college_management_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username is required"));
        }

        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
        }

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already exists"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists"));
        }

        LocalDateTime now = LocalDateTime.now();

        User user = new User();

        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setAccountStatus("ACTIVE");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User savedUser = userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "userId", savedUser.getUserId(),
                        "username", savedUser.getUsername(),
                        "email", savedUser.getEmail(),
                        "accountStatus", savedUser.getAccountStatus()
                ));
    }


@GetMapping("/student-accounts")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
public ResponseEntity<?> getAvailableStudentAccounts(
        @RequestParam(required = false) Long includeUserId) {

    return ResponseEntity.ok(
            userRepository.findAvailableStudentAccounts(includeUserId)
    );
}

@GetMapping("/faculty-accounts")
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public ResponseEntity<?> getAvailableFacultyAccounts(
        @RequestParam(required = false) Long includeUserId) {

    return ResponseEntity.ok(
            userRepository.findAvailableFacultyAccounts(includeUserId)
    );
}

@GetMapping("/staff-accounts")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> getAvailableStaffAccounts(
        @RequestParam(required = false) Long includeUserId) {

    return ResponseEntity.ok(
            userRepository.findAvailableStaffAccounts(includeUserId)
    );
}

}

