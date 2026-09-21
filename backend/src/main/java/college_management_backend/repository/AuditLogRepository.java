package college_management_backend.repository;

import college_management_backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByTableNameOrderByTimestampDesc(
            String tableName);

    List<AuditLog> findByRecordIdOrderByTimestampDesc(
            Long recordId);

    List<AuditLog> findByUserIdOrderByTimestampDesc(
            Long userId);
}