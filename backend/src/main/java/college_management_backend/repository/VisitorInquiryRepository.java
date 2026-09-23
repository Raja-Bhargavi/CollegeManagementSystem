package college_management_backend.repository;

import college_management_backend.entity.VisitorInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorInquiryRepository
        extends JpaRepository<VisitorInquiry, Long> {
}