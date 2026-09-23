package college_management_backend.repository;

import college_management_backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCreatedBy(Long createdBy);

    List<Event> findByStatus(String status);

    List<Event> findByStatusOrderByEventDateAsc(String status);

    List<Event> findAllByOrderByEventDateAsc();
}