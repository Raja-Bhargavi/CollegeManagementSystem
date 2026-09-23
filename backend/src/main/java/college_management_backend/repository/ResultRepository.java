package college_management_backend.repository;

import college_management_backend.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByStudentId(Long studentId);

    List<Result> findBySemesterId(Long semesterId);

    boolean existsByStudentIdAndSemesterId(
            Long studentId,
            Long semesterId
    );

    boolean existsByStudentIdAndSemesterIdAndResultIdNot(
            Long studentId,
            Long semesterId,
            Long resultId
    );
}