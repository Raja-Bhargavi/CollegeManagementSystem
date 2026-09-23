package college_management_backend.controller;

import college_management_backend.dto.NotificationRequest;
import college_management_backend.dto.NotificationResponse;
import college_management_backend.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody NotificationRequest request) {

        NotificationResponse response =
                notificationService.createNotification(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<NotificationResponse>>
    getNotificationsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getNotificationsByUser(userId)
        );
    }

    @GetMapping("/{notificationId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<NotificationResponse>
    getNotificationById(
            @PathVariable Long notificationId) {

        return ResponseEntity.ok(
                notificationService
                        .getNotificationById(notificationId)
        );
    }

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<NotificationResponse>
    markAsRead(
            @PathVariable Long notificationId) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(notificationId)
        );
    }
}