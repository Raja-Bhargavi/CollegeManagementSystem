package college_management_backend.controller;

import college_management_backend.dto.NoticeRequest;
import college_management_backend.dto.NoticeResponse;
import college_management_backend.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<NoticeResponse>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/{noticeId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<NoticeResponse> getNoticeById(
            @PathVariable Long noticeId) {

        return ResponseEntity.ok(noticeService.getNoticeById(noticeId));
    }

    @GetMapping("/created-by/{createdBy}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<NoticeResponse>> getNoticesByCreatedBy(
            @PathVariable Long createdBy) {

        return ResponseEntity.ok(
                noticeService.getNoticesByCreatedBy(createdBy)
        );
    }

    @GetMapping("/visibility/{visibility}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<NoticeResponse>> getNoticesByVisibility(
            @PathVariable String visibility) {

        return ResponseEntity.ok(
                noticeService.getNoticesByVisibility(visibility)
        );
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<NoticeResponse>> getNoticesByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                noticeService.getNoticesByStatus(status)
        );
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','FACULTY')")
    public ResponseEntity<List<NoticeResponse>> getNoticesByVisibilityAndStatus(
            @RequestParam String visibility,
            @RequestParam String status) {

        return ResponseEntity.ok(
                noticeService.getNoticesByVisibilityAndStatus(
                        visibility,
                        status
                )
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<NoticeResponse> createNotice(
            @Valid @RequestBody NoticeRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noticeService.createNotice(request));
    }

    @PutMapping("/{noticeId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<NoticeResponse> updateNotice(
            @PathVariable Long noticeId,
            @Valid @RequestBody NoticeRequest request) {

        return ResponseEntity.ok(
                noticeService.updateNotice(noticeId, request)
        );
    }

    @DeleteMapping("/{noticeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNotice(
            @PathVariable Long noticeId) {

        noticeService.deleteNotice(noticeId);

        return ResponseEntity.noContent().build();
    }
}
