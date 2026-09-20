package college_management_backend.service;

import college_management_backend.dto.AttendanceRequest;
import college_management_backend.dto.AttendanceResponse;
import college_management_backend.entity.Attendance;
import college_management_backend.repository.AttendanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository) {

        this.attendanceRepository = attendanceRepository;
    }

    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AttendanceResponse getAttendanceById(
            Long attendanceId) {

        Attendance attendance =
                attendanceRepository.findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found with ID: "
                                                + attendanceId
                                )
                        );

        return toResponse(attendance);
    }

    public List<AttendanceResponse> getAttendanceByRegistration(
            Long registrationId) {

        return attendanceRepository
                .findByRegistrationId(registrationId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse markAttendance(
            AttendanceRequest request) {

        if (attendanceRepository
                .existsByRegistrationIdAndAttendanceDate(
                        request.getRegistrationId(),
                        request.getAttendanceDate())) {

            throw new RuntimeException(
                    "Attendance already marked for this registration on this date"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setRegistrationId(
                request.getRegistrationId()
        );

        attendance.setAttendanceDate(
                request.getAttendanceDate()
        );

        attendance.setStatus(
                request.getStatus()
        );

        attendance.setMarkedBy(
                request.getMarkedBy()
        );

        attendance.setMarkedAt(
                LocalDateTime.now()
        );

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        return toResponse(savedAttendance);
    }

    private AttendanceResponse toResponse(
            Attendance attendance) {

        return new AttendanceResponse(
                attendance.getAttendanceId(),
                attendance.getRegistrationId(),
                attendance.getAttendanceDate(),
                attendance.getStatus(),
                attendance.getMarkedBy(),
                attendance.getMarkedAt()
        );
    }
}
