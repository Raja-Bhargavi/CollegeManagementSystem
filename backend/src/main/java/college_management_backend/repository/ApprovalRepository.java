package college_management_backend.repository;

import college_management_backend.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    List<Approval> findByApplicationId(Long applicationId);

    List<Approval> findByApproverUserId(Long approverUserId);
}