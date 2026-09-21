package college_management_backend.repository;

import college_management_backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantUserId(Long applicantUserId);

    List<Application> findByStatus(String status);
}