package college_management_backend.service;

import college_management_backend.dto.CourseRegistrationRequest;
import college_management_backend.dto.CourseRegistrationResponse;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.CourseRegistration;
import college_management_backend.entity.Student;
import college_management_backend.exception.DuplicateRegistrationException;
import college_management_backend.exception.RegistrationNotFoundException;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.CourseRegistrationRepository;
import college_management_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
                .toList();
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

    public List<CourseRegistrationResponse> getRegistrationsByStudent(
            Long studentId) {

        return courseRegistrationRepository
                .findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CourseRegistrationResponse registerStudent(
            CourseRegistrationRequest request) {

        validateRequest(request);

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

    @Transactional
    public CourseRegistrationResponse updateRegistration(
            Long registrationId,
            CourseRegistrationRequest request) {

        validateRequest(request);

        CourseRegistration registration =
                courseRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "Registration not found with ID: "
                                                + registrationId
                                )
                        );

        validateStudent(request.getStudentId());
        validateOffering(request.getOfferingId());

        boolean studentChanged =
                !registration.getStudentId()
                        .equals(request.getStudentId());

        boolean offeringChanged =
                !registration.getOfferingId()
                        .equals(request.getOfferingId());

        if (studentChanged || offeringChanged) {

            courseRegistrationRepository
                    .findByStudentIdAndOfferingId(
                            request.getStudentId(),
                            request.getOfferingId()
                    )
                    .ifPresent(existing -> {

                        if (!existing.getRegistrationId()
                                .equals(registrationId)) {

                            throw new DuplicateRegistrationException(
                                    "Student is already registered "
                                            + "for this course offering"
                            );
                        }
                    });
        }

        registration.setStudentId(
                request.getStudentId()
        );

        registration.setOfferingId(
                request.getOfferingId()
        );

        CourseRegistration updatedRegistration =
                courseRegistrationRepository.save(
                        registration
                );

        return toResponse(updatedRegistration);
    }

    @Transactional
    public void deleteRegistration(Long registrationId) {

        CourseRegistration registration =
                courseRegistrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "Registration not found with ID: "
                                                + registrationId
                                )
                        );

        courseRegistrationRepository.delete(registration);
    }

    private void validateRequest(
            CourseRegistrationRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Registration request is required"
            );
        }

        if (request.getStudentId() == null) {
            throw new RuntimeException(
                    "Student ID is required"
            );
        }

        if (request.getOfferingId() == null) {
            throw new RuntimeException(
                    "Offering ID is required"
            );
        }
    }

    private void validateStudent(Long studentId) {

        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found with ID: "
                                                + studentId
                                )
                        );

        if (!"ACTIVE".equalsIgnoreCase(
                student.getStudentStatus())) {

            throw new RuntimeException(
                    "Student is not active and cannot register for courses"
            );
        }
    }

    private void validateOffering(Long offeringId) {

        CourseOffering offering =
                courseOfferingRepository.findById(offeringId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + offeringId
                                )
                        );

        if (!"ACTIVE".equalsIgnoreCase(
                offering.getOfferingStatus())) {

            throw new RuntimeException(
                    "Course offering is not active"
            );
        }
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