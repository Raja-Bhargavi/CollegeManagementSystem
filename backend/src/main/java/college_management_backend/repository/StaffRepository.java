package college_management_backend.repository;

import college_management_backend.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByUserId(Long userId);

    Optional<Staff> findByEmployeeNumber(String employeeNumber);

    boolean existsByUserId(Long userId);

    boolean existsByEmployeeNumber(String employeeNumber);
}