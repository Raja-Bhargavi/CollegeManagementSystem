package college_management_backend.repository;

import college_management_backend.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarkRepository
        extends JpaRepository<Mark, Long> {

    List<Mark> findByExamId(Long examId);

    List<Mark> findByStudentId(Long studentId);

    boolean existsByExamIdAndStudentId(
            Long examId,
            Long studentId
    );

    boolean existsByExamIdAndStudentIdAndMarkIdNot(
            Long examId,
            Long studentId,
            Long markId
    );
}