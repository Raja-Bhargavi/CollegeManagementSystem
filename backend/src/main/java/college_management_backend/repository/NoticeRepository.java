package college_management_backend.repository;

import college_management_backend.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findByCreatedBy(Long createdBy);

    List<Notice> findByVisibility(String visibility);

    List<Notice> findByStatus(String status);

    List<Notice> findByVisibilityAndStatus(String visibility, String status);
}