package college_management_backend.service;

import college_management_backend.dto.AuditLogRequest;
import college_management_backend.dto.AuditLogResponse;
import college_management_backend.entity.AuditLog;
import college_management_backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Create a new audit log
    public AuditLogResponse createAuditLog(AuditLogRequest request) {

        AuditLog auditLog = new AuditLog();

        auditLog.setUserId(request.getUserId());
        auditLog.setAction(request.getAction());
        auditLog.setTableName(request.getTableName());
        auditLog.setRecordId(request.getRecordId());
        auditLog.setOldValue(request.getOldValue());
        auditLog.setNewValue(request.getNewValue());
        auditLog.setTimestamp(LocalDateTime.now());

        AuditLog savedAuditLog =
                auditLogRepository.save(auditLog);

        return convertToResponse(savedAuditLog);
    }

    // Get audit log by ID
    public AuditLogResponse getAuditLogById(Long auditId) {

        AuditLog auditLog =
                auditLogRepository.findById(auditId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Audit log not found with id: "
                                                + auditId));

        return convertToResponse(auditLog);
    }

    // Get audit logs by table name
    public List<AuditLogResponse> getByTableName(
            String tableName) {

        return auditLogRepository
                .findByTableNameOrderByTimestampDesc(tableName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get audit logs by record ID
    public List<AuditLogResponse> getByRecordId(
            Long recordId) {

        return auditLogRepository
                .findByRecordIdOrderByTimestampDesc(recordId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get audit logs by user ID
    public List<AuditLogResponse> getByUserId(
            Long userId) {

        return auditLogRepository
                .findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Convert Entity to Response DTO
    private AuditLogResponse convertToResponse(
            AuditLog auditLog) {

        AuditLogResponse response =
                new AuditLogResponse();

        response.setAuditId(auditLog.getAuditId());
        response.setUserId(auditLog.getUserId());
        response.setAction(auditLog.getAction());
        response.setTableName(auditLog.getTableName());
        response.setRecordId(auditLog.getRecordId());
        response.setOldValue(auditLog.getOldValue());
        response.setNewValue(auditLog.getNewValue());
        response.setTimestamp(auditLog.getTimestamp());

        return response;
    }
}