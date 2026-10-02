package college_management_backend.service;

import college_management_backend.dto.CourseRegistrationRequest;
import college_management_backend.dto.CourseRegistrationResponse;

import college_management_backend.entity.Course;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.CourseRegistration;
import college_management_backend.entity.Faculty;
import college_management_backend.entity.Section;
import college_management_backend.entity.Student;

import college_management_backend.exception.DuplicateRegistrationException;
import college_management_backend.exception.RegistrationNotFoundException;

import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.CourseRegistrationRepository;
import college_management_backend.repository.CourseRepository;
import college_management_backend.repository.FacultyRepository;
import college_management_backend.repository.SectionRepository;
import college_management_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseRegistrationService {

    private final CourseRegistrationRepository
            courseRegistrationRepository;

    private final StudentRepository
            studentRepository;

    private final CourseOfferingRepository
            courseOfferingRepository;

    private final CourseRepository
            courseRepository;

    private final FacultyRepository
            facultyRepository;

    private final SectionRepository
            sectionRepository;

    public CourseRegistrationService(
            CourseRegistrationRepository courseRegistrationRepository,
            StudentRepository studentRepository,
            CourseOfferingRepository courseOfferingRepository,
            CourseRepository courseRepository,
            FacultyRepository facultyRepository,
            SectionRepository sectionRepository) {

        this.courseRegistrationRepository =
                courseRegistrationRepository;

        this.studentRepository =
                studentRepository;

        this.courseOfferingRepository =
                courseOfferingRepository;

        this.courseRepository =
                courseRepository;

        this.facultyRepository =
                facultyRepository;

        this.sectionRepository =
                sectionRepository;
    }

    // =========================================================
    // GET ALL REGISTRATIONS
    // =========================================================

    public List<CourseRegistrationResponse> getAllRegistrations() {

        return courseRegistrationRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // GET REGISTRATION BY ID
    // =========================================================

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

    // =========================================================
    // GET REGISTRATIONS BY STUDENT
    // =========================================================

    public List<CourseRegistrationResponse>
    getRegistrationsByStudent(Long studentId) {

        return courseRegistrationRepository
                .findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

         // =========================================================
        // GET REGISTRATIONS BY FACULTY
        // FACULTY - MY REGISTERED STUDENTS
        // =========================================================

        public List<CourseRegistrationResponse>
        getRegistrationsByFaculty(Long facultyId) {

        if (!facultyRepository.existsById(facultyId)) {

                throw new RuntimeException(
                        "Faculty not found with ID: " + facultyId
                );
        }

        List<CourseOffering> offerings =
                courseOfferingRepository
                        .findByFacultyId(facultyId);

        return offerings
                .stream()
                .flatMap(offering ->
                        courseRegistrationRepository
                                .findByOfferingId(
                                        offering.getOfferingId()
                                )
                                .stream()
                )
                .filter(registration ->
                        "REGISTERED".equalsIgnoreCase(
                                registration.getStatus()
                        )
                )
                .map(this::toResponse)
                .toList();
        }

    // =========================================================
    // REGISTER STUDENT
    // =========================================================

    @Transactional
    public CourseRegistrationResponse registerStudent(
            CourseRegistrationRequest request) {

        validateRequest(request);

        Student student =
                studentRepository
                        .findById(request.getStudentId())
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

        registration.setStatus(
                "REGISTERED"
        );

        CourseRegistration savedRegistration =
                courseRegistrationRepository.save(
                        registration
                );

        return toResponse(savedRegistration);
    }

    // =========================================================
    // UPDATE REGISTRATION
    // =========================================================

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

        validateStudent(
                request.getStudentId()
        );

        validateOffering(
                request.getOfferingId()
        );

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

                        if (!existing
                                .getRegistrationId()
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

    // =========================================================
    // DELETE REGISTRATION
    // =========================================================

    @Transactional
    public void deleteRegistration(
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

        courseRegistrationRepository.delete(
                registration
        );
    }

    // =========================================================
    // VALIDATE REQUEST
    // =========================================================

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

    // =========================================================
    // VALIDATE STUDENT
    // =========================================================

    private void validateStudent(
            Long studentId) {

        Student student =
                studentRepository
                        .findById(studentId)
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

    // =========================================================
    // VALIDATE OFFERING
    // =========================================================

    private void validateOffering(
            Long offeringId) {

        CourseOffering offering =
                courseOfferingRepository
                        .findById(offeringId)
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

    // =========================================================
    // CONVERT REGISTRATION TO RESPONSE
    // =========================================================

    private CourseRegistrationResponse toResponse(
            CourseRegistration registration) {

        // -----------------------------------------
        // COURSE OFFERING
        // -----------------------------------------

        CourseOffering offering =
                courseOfferingRepository
                        .findById(
                                registration.getOfferingId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + registration
                                                .getOfferingId()
                                )
                        );

        // -----------------------------------------
        // COURSE
        // -----------------------------------------

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

        // -----------------------------------------
        // SECTION
        // -----------------------------------------

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

        // -----------------------------------------
        // FACULTY
        // -----------------------------------------

        Faculty faculty =
                facultyRepository
                        .findById(
                                offering.getFacultyId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found with ID: "
                                                + offering.getFacultyId()
                                )
                        );

        // -----------------------------------------
        // FACULTY NAME
        // -----------------------------------------

        String facultyName =
                faculty.getFirstName();

        if (faculty.getLastName() != null
                && !faculty.getLastName().isBlank()) {

            facultyName +=
                    " " + faculty.getLastName();
        }

        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        return new CourseRegistrationResponse(

                registration.getRegistrationId(),

                registration.getStudentId(),

                registration.getOfferingId(),

                course.getCourseCode(),

                course.getCourseName(),

                section.getSectionName(),

                facultyName,

                registration.getRegistrationDate(),

                registration.getStatus()
        );
    }
}