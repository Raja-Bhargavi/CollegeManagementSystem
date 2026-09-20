package college_management_backend.repository;

import college_management_backend.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExaminationRepository
        extends JpaRepository<Examination, Long> {

    List<Examination> findByOfferingId(Long offeringId);
}