package college_management_backend.controller;

import college_management_backend.dto.AuditLogRequest;
import college_management_backend.dto.AuditLogResponse;
import college_management_backend.service.AuditLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(
            AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    // Create audit log
    @PostMapping
    public ResponseEntity<AuditLogResponse> createAuditLog(
            @RequestBody AuditLogRequest request) {

        AuditLogResponse response =
                auditLogService.createAuditLog(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get audit log by ID
    @GetMapping("/{auditId}")
    public ResponseEntity<AuditLogResponse> getAuditLogById(
            @PathVariable Long auditId) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogById(auditId)
        );
    }

    // Get audit logs by table name
    @GetMapping("/table/{tableName}")
    public ResponseEntity<List<AuditLogResponse>>
    getByTableName(
            @PathVariable String tableName) {

        return ResponseEntity.ok(
                auditLogService.getByTableName(tableName)
        );
    }

    // Get audit logs by record ID
    @GetMapping("/record/{recordId}")
    public ResponseEntity<List<AuditLogResponse>>
    getByRecordId(
            @PathVariable Long recordId) {

        return ResponseEntity.ok(
                auditLogService.getByRecordId(recordId)
        );
    }

    // Get audit logs by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>>
    getByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                auditLogService.getByUserId(userId)
        );
    }
}