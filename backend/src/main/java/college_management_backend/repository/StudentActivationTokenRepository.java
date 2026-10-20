
package college_management_backend.repository;

import college_management_backend.entity.StudentActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentActivationTokenRepository
        extends JpaRepository<StudentActivationToken, Long> {

    Optional<StudentActivationToken> findByTokenHash(String tokenHash);

    Optional<StudentActivationToken> findByUserId(Long userId);
}
