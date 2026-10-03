package college_management_backend.repository;

import college_management_backend.entity.Management;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagementRepository
        extends JpaRepository<Management, Long> {

    Optional<Management> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}