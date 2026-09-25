package college_management_backend.repository;

import college_management_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRollNumber(String rollNumber);

    boolean existsByUserId(Long userId);

    Optional<Student> findByUserId(Long userId);

    boolean existsByRollNumberAndStudentIdNot(String rollNumber, Long studentId);
}