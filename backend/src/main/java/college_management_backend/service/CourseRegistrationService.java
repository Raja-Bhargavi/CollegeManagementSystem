package college_management_backend.service;

import college_management_backend.dto.CourseRegistrationRequest;
import college_management_backend.dto.CourseRegistrationResponse;
import college_management_backend.entity.CourseRegistration;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.Student;
import college_management_backend.repository.CourseRegistrationRepository;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.StudentRepository;
import college_management_backend.exception.DuplicateRegistrationException;
import college_management_backend.exception.RegistrationNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseRegistrationService {

    private final CourseRegistrationRepository
            courseRegistrationRepository;

    private final StudentRepository studentRepository;

    private final CourseOfferingRepository
            courseOfferingRepository;

    public CourseRegistrationService(
            CourseRegistrationRepository courseRegistrationRepository,
            StudentRepository studentRepository,
            CourseOfferingRepository courseOfferingRepository) {

        this.courseRegistrationRepository =
                courseRegistrationRepository;

        this.studentRepository =
                studentRepository;

        this.courseOfferingRepository =
                courseOfferingRepository;
    }

    public List<CourseRegistrationResponse> getAllRegistrations() {

        return courseRegistrationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourseRegistrationResponse getRegistrationById(
            Long registrationId) {

        CourseRegistration registration =
                courseRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "Registration not found with ID: "
                                                + registrationId
                                )
                        );

        return toResponse(registration);
    }

    @Transactional
    public CourseRegistrationResponse registerStudent(
            CourseRegistrationRequest request) {

        Student student =
                studentRepository.findById(request.getStudentId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found with ID: "
                                                + request.getStudentId()
                                )
                        );

        if (!"ACTIVE".equalsIgnoreCase(
                student.getStudentStatus())) {

            throw new RuntimeException(
                    "Student is not active and cannot register for courses"
            );
        }

        CourseOffering offering =
                courseOfferingRepository
                        .findById(request.getOfferingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + request.getOfferingId()
                                )
                        );

        if (!"ACTIVE".equalsIgnoreCase(
                offering.getOfferingStatus())) {

            throw new RuntimeException(
                    "Course offering is not active"
            );
        }

        if (courseRegistrationRepository
                .existsByStudentIdAndOfferingId(
                        request.getStudentId(),
                        request.getOfferingId())) {

            throw new DuplicateRegistrationException(
                    "Student is already registered for this course offering"
            );
        }

        CourseRegistration registration =
                new CourseRegistration();

        registration.setStudentId(
                request.getStudentId()
        );

        registration.setOfferingId(
                request.getOfferingId()
        );

        registration.setRegistrationDate(
                LocalDateTime.now()
        );

        registration.setStatus("REGISTERED");

        CourseRegistration savedRegistration =
                courseRegistrationRepository.save(
                        registration
                );

        return toResponse(savedRegistration);
    }

    private CourseRegistrationResponse toResponse(
            CourseRegistration registration) {

        return new CourseRegistrationResponse(
                registration.getRegistrationId(),
                registration.getStudentId(),
                registration.getOfferingId(),
                registration.getRegistrationDate(),
                registration.getStatus()
        );
    }
}