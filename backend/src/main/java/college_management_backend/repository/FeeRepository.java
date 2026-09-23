package college_management_backend.repository;

import college_management_backend.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByStudentId(Long studentId);

    List<Fee> findBySemesterId(Long semesterId);

    List<Fee> findByStatus(String status);

    boolean existsByStudentIdAndSemesterIdAndFeeType(
            Long studentId,
            Long semesterId,
            String feeType
    );

    boolean existsByStudentIdAndSemesterIdAndFeeTypeAndFeeIdNot(
            Long studentId,
            Long semesterId,
            String feeType,
            Long feeId
    );
}