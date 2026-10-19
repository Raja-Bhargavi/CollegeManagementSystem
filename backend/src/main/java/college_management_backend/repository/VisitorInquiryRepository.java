
package college_management_backend.repository;

import college_management_backend.entity.VisitorInquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitorInquiryRepository
        extends JpaRepository<VisitorInquiry, Long> {

    List<VisitorInquiry> findAllByOrderByCreatedAtDesc();
}
