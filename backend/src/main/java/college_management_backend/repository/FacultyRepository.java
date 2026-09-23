package college_management_backend.repository;

import college_management_backend.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByUserId(Long userId);

    Optional<Faculty> findByEmployeeNumber(String employeeNumber);

    boolean existsByUserId(Long userId);

    boolean existsByEmployeeNumber(String employeeNumber);
}