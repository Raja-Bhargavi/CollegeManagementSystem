package college_management_backend.service;

import college_management_backend.dto.AttendanceRequest;
import college_management_backend.dto.AttendanceResponse;
import college_management_backend.entity.Attendance;
import college_management_backend.entity.CourseRegistration;
import college_management_backend.repository.AttendanceRepository;
import college_management_backend.repository.CourseRegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            CourseRegistrationRepository courseRegistrationRepository) {

        this.attendanceRepository = attendanceRepository;
        this.courseRegistrationRepository = courseRegistrationRepository;
    }

    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AttendanceResponse getAttendanceById(Long attendanceId) {

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

        validateRegistration(request.getRegistrationId());

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

    @Transactional
    public AttendanceResponse updateAttendance(
            Long attendanceId,
            AttendanceRequest request) {

        Attendance attendance =
                attendanceRepository.findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found with ID: "
                                                + attendanceId
                                )
                        );

        validateRegistration(request.getRegistrationId());

        boolean duplicate =
                attendanceRepository
                        .existsByRegistrationIdAndAttendanceDateAndAttendanceIdNot(
                                request.getRegistrationId(),
                                request.getAttendanceDate(),
                                attendanceId
                        );

        if (duplicate) {
            throw new RuntimeException(
                    "Attendance already marked for this registration on this date"
            );
        }

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

        Attendance updatedAttendance =
                attendanceRepository.save(attendance);

        return toResponse(updatedAttendance);
    }

    @Transactional
    public void deleteAttendance(Long attendanceId) {

        if (!attendanceRepository.existsById(attendanceId)) {

            throw new RuntimeException(
                    "Attendance not found with ID: "
                            + attendanceId
            );
        }

        attendanceRepository.deleteById(attendanceId);
    }

    private void validateRegistration(Long registrationId) {

        CourseRegistration registration =
                courseRegistrationRepository.findById(registrationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course registration not found with ID: "
                                                + registrationId
                                )
                        );

        if (!"REGISTERED".equalsIgnoreCase(
                registration.getStatus())) {

            throw new RuntimeException(
                    "Attendance can only be marked for a REGISTERED course registration"
            );
        }
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