package college_management_backend.repository;

import college_management_backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    boolean existsByRegistrationIdAndAttendanceDate(
            Long registrationId,
            LocalDate attendanceDate
    );

    List<Attendance> findByRegistrationId(
            Long registrationId
    );
}