package college_management_backend.service;

import college_management_backend.dto.AttendanceRequest;
import college_management_backend.dto.AttendanceResponse;
import college_management_backend.dto.FacultyAttendanceResponse;

import college_management_backend.entity.Attendance;
import college_management_backend.entity.Course;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.CourseRegistration;
import college_management_backend.entity.Faculty;
import college_management_backend.entity.Section;
import college_management_backend.entity.Student;

import college_management_backend.repository.AttendanceRepository;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.CourseRegistrationRepository;
import college_management_backend.repository.CourseRepository;
import college_management_backend.repository.FacultyRepository;
import college_management_backend.repository.SectionRepository;
import college_management_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    private final CourseRegistrationRepository
            courseRegistrationRepository;

    private final CourseOfferingRepository
            courseOfferingRepository;

    private final CourseRepository
            courseRepository;

    private final SectionRepository
            sectionRepository;

    private final StudentRepository
            studentRepository;

    private final FacultyRepository
            facultyRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            CourseRegistrationRepository courseRegistrationRepository,
            CourseOfferingRepository courseOfferingRepository,
            CourseRepository courseRepository,
            SectionRepository sectionRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository) {

        this.attendanceRepository =
                attendanceRepository;

        this.courseRegistrationRepository =
                courseRegistrationRepository;

        this.courseOfferingRepository =
                courseOfferingRepository;

        this.courseRepository =
                courseRepository;

        this.sectionRepository =
                sectionRepository;

        this.studentRepository =
                studentRepository;

        this.facultyRepository =
                facultyRepository;
    }

    // =========================================================
    // GET ALL ATTENDANCE
    // =========================================================

    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // STUDENT - MY ATTENDANCE
    // =========================================================

    public List<AttendanceResponse> getAttendanceByStudent(
            Long studentId) {

        List<CourseRegistration> registrations =
                courseRegistrationRepository
                        .findByStudentId(studentId);

        List<AttendanceResponse> result =
                new ArrayList<>();

        for (CourseRegistration registration :
                registrations) {

            List<Attendance> attendanceList =
                    attendanceRepository
                            .findByRegistrationId(
                                    registration
                                            .getRegistrationId()
                            );

            result.addAll(
                    attendanceList
                            .stream()
                            .map(this::toResponse)
                            .toList()
            );
        }

        return result;
    }

    // =========================================================
    // FACULTY - MY ATTENDANCE
    // =========================================================

        public List<FacultyAttendanceResponse>
                getAttendanceByFaculty(Long facultyId) {

                System.out.println("======================================");
                System.out.println("FACULTY ATTENDANCE REQUEST");
                System.out.println("facultyId = " + facultyId);

                if (!facultyRepository.existsById(facultyId)) {
                        throw new RuntimeException(
                                "Faculty not found with ID: " + facultyId
                        );
                }

                List<CourseOffering> offerings =
                        courseOfferingRepository.findByFacultyId(facultyId);

                System.out.println(
                        "Course offerings found = " + offerings.size()
                );

                List<FacultyAttendanceResponse> result =
                        new ArrayList<>();

                for (CourseOffering offering : offerings) {

                        System.out.println(
                                "Offering ID = " + offering.getOfferingId()
                        );

                        System.out.println(
                                "Course ID = " + offering.getCourseId()
                        );

                        System.out.println(
                                "Section ID = " + offering.getSectionId()
                        );

                        System.out.println(
                                "Faculty ID = " + offering.getFacultyId()
                        );

                        List<CourseRegistration> registrations =
                                courseRegistrationRepository
                                        .findByOfferingId(
                                                offering.getOfferingId()
                                        );

                        System.out.println(
                                "Registrations found = "
                                        + registrations.size()
                        );

                        for (CourseRegistration registration :
                                registrations) {

                        System.out.println(
                                "Registration ID = "
                                        + registration.getRegistrationId()
                        );

                        List<Attendance> attendanceList =
                                attendanceRepository
                                        .findByRegistrationId(
                                                registration
                                                        .getRegistrationId()
                                        );

                        System.out.println(
                                "Attendance records found = "
                                        + attendanceList.size()
                        );

                        for (Attendance attendance :
                                attendanceList) {

                                System.out.println(
                                        "Attendance ID = "
                                                + attendance.getAttendanceId()
                                );

                                System.out.println(
                                        "Date = "
                                                + attendance.getAttendanceDate()
                                );

                                System.out.println(
                                        "Status = "
                                                + attendance.getStatus()
                                );

                                result.add(
                                        toFacultyResponse(
                                                attendance,
                                                offering,
                                                registration
                                        )
                                );
                        }
                        }
                }

                System.out.println(
                        "FINAL FACULTY ATTENDANCE COUNT = "
                                + result.size()
                );

                System.out.println("======================================");

                return result;
                }

    // =========================================================
    // GET ATTENDANCE BY ID
    // =========================================================

    public AttendanceResponse getAttendanceById(
            Long attendanceId) {

        Attendance attendance =
                attendanceRepository.findById(
                        attendanceId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Attendance not found with ID: "
                                        + attendanceId
                        )
                );

        return toResponse(attendance);
    }

    // =========================================================
    // GET BY REGISTRATION
    // =========================================================

    public List<AttendanceResponse>
    getAttendanceByRegistration(
            Long registrationId) {

        return attendanceRepository
                .findByRegistrationId(registrationId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // MARK ATTENDANCE
    // =========================================================

    @Transactional
    public AttendanceResponse markAttendance(
            AttendanceRequest request) {

        validateRegistration(
                request.getRegistrationId()
        );

        if (attendanceRepository
                .existsByRegistrationIdAndAttendanceDate(
                        request.getRegistrationId(),
                        request.getAttendanceDate()
                )) {

            throw new RuntimeException(
                    "Attendance already marked for this registration on this date"
            );
        }

        Attendance attendance =
                new Attendance();

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

        return toResponse(
                attendanceRepository.save(
                        attendance
                )
        );
    }

    // =========================================================
    // UPDATE ATTENDANCE
    // =========================================================

    @Transactional
    public AttendanceResponse updateAttendance(
            Long attendanceId,
            AttendanceRequest request) {

        Attendance attendance =
                attendanceRepository
                        .findById(attendanceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found with ID: "
                                                + attendanceId
                                )
                        );

        validateRegistration(
                request.getRegistrationId()
        );

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

        return toResponse(
                attendanceRepository.save(
                        attendance
                )
        );
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Transactional
    public void deleteAttendance(
            Long attendanceId) {

        if (!attendanceRepository
                .existsById(attendanceId)) {

            throw new RuntimeException(
                    "Attendance not found with ID: "
                            + attendanceId
            );
        }

        attendanceRepository.deleteById(
                attendanceId
        );
    }

    // =========================================================
    // VALIDATE REGISTRATION
    // =========================================================

    private void validateRegistration(
            Long registrationId) {

        CourseRegistration registration =
                courseRegistrationRepository
                        .findById(registrationId)
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

    // =========================================================
    // BASIC ATTENDANCE RESPONSE
    // =========================================================

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

    // =========================================================
    // FACULTY ATTENDANCE RESPONSE
    // =========================================================

    private FacultyAttendanceResponse toFacultyResponse(
            Attendance attendance,
            CourseOffering offering,
            CourseRegistration registration) {

        Course course =
                courseRepository
                        .findById(
                                offering.getCourseId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found with ID: "
                                                + offering.getCourseId()
                                )
                        );

        Section section =
                sectionRepository
                        .findById(
                                offering.getSectionId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Section not found with ID: "
                                                + offering.getSectionId()
                                )
                        );

        Student student =
                studentRepository
                        .findById(
                                registration.getStudentId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found with ID: "
                                                + registration.getStudentId()
                                )
                        );

        String studentName =
                student.getFirstName();

        if (student.getLastName() != null
                && !student.getLastName().isBlank()) {

            studentName +=
                    " " + student.getLastName();
        }

        return new FacultyAttendanceResponse(

                attendance.getAttendanceId(),

                course.getCourseCode(),
                course.getCourseName(),

                section.getSectionName(),

                studentName,
                student.getRollNumber(),

                attendance.getAttendanceDate(),

                attendance.getStatus(),

                attendance.getMarkedAt()
        );
    }
}