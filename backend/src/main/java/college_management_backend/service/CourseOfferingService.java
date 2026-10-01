package college_management_backend.service;

import college_management_backend.dto.CourseOfferingRequest;
import college_management_backend.dto.CourseOfferingResponse;
import college_management_backend.entity.Course;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.Faculty;
import college_management_backend.entity.Section;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.CourseRepository;
import college_management_backend.repository.FacultyRepository;
import college_management_backend.repository.SectionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;
    private final SectionRepository sectionRepository;

    public CourseOfferingService(
            CourseOfferingRepository courseOfferingRepository,
            CourseRepository courseRepository,
            FacultyRepository facultyRepository,
            SectionRepository sectionRepository) {

        this.courseOfferingRepository = courseOfferingRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
        this.sectionRepository = sectionRepository;
    }

    // =========================================================
    // GET ALL OFFERINGS
    // =========================================================

    public List<CourseOfferingResponse> getAllOfferings() {

        return courseOfferingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // GET OFFERING BY ID
    // =========================================================

    public CourseOfferingResponse getOfferingById(Long id) {

        CourseOffering offering =
                courseOfferingRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with id: " + id
                                ));

        return toResponse(offering);
    }

    // =========================================================
    // GET OFFERINGS BY FACULTY
    // =========================================================

    public List<CourseOfferingResponse> getOfferingsByFaculty(
            Long facultyId) {

        if (!facultyRepository.existsById(facultyId)) {
            throw new RuntimeException(
                    "Faculty not found with id: " + facultyId
            );
        }

        return courseOfferingRepository
                .findByFacultyId(facultyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // CREATE OFFERING
    // =========================================================

    public CourseOfferingResponse createOffering(
            CourseOfferingRequest request) {

        if (!courseRepository.existsById(request.getCourseId())) {

            throw new RuntimeException(
                    "Course not found with id: "
                            + request.getCourseId()
            );
        }

        if (!sectionRepository.existsById(request.getSectionId())) {

            throw new RuntimeException(
                    "Section not found with id: "
                            + request.getSectionId()
            );
        }

        if (!facultyRepository.existsById(request.getFacultyId())) {

            throw new RuntimeException(
                    "Faculty not found with id: "
                            + request.getFacultyId()
            );
        }

        boolean exists =
                courseOfferingRepository
                        .existsByCourseIdAndSectionIdAndFacultyId(
                                request.getCourseId(),
                                request.getSectionId(),
                                request.getFacultyId()
                        );

        if (exists) {

            throw new RuntimeException(
                    "Course offering already exists for this course, section and faculty."
            );
        }

        CourseOffering offering =
                new CourseOffering();

        offering.setCourseId(
                request.getCourseId()
        );

        offering.setSectionId(
                request.getSectionId()
        );

        offering.setFacultyId(
                request.getFacultyId()
        );

        offering.setOfferingStatus(
                request.getOfferingStatus()
        );

        CourseOffering savedOffering =
                courseOfferingRepository.save(offering);

        return toResponse(savedOffering);
    }

    // =========================================================
    // UPDATE OFFERING
    // =========================================================

    public CourseOfferingResponse updateOffering(
            Long id,
            CourseOfferingRequest request) {

        CourseOffering offering =
                courseOfferingRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with id: "
                                                + id
                                ));

        if (!courseRepository.existsById(request.getCourseId())) {

            throw new RuntimeException(
                    "Course not found with id: "
                            + request.getCourseId()
            );
        }

        if (!sectionRepository.existsById(request.getSectionId())) {

            throw new RuntimeException(
                    "Section not found with id: "
                            + request.getSectionId()
            );
        }

        if (!facultyRepository.existsById(request.getFacultyId())) {

            throw new RuntimeException(
                    "Faculty not found with id: "
                            + request.getFacultyId()
            );
        }

        boolean combinationChanged =
                !request.getCourseId()
                        .equals(offering.getCourseId())
                        || !request.getSectionId()
                        .equals(offering.getSectionId())
                        || !request.getFacultyId()
                        .equals(offering.getFacultyId());

        if (combinationChanged) {

            boolean exists =
                    courseOfferingRepository
                            .existsByCourseIdAndSectionIdAndFacultyId(
                                    request.getCourseId(),
                                    request.getSectionId(),
                                    request.getFacultyId()
                            );

            if (exists) {

                throw new RuntimeException(
                        "Another course offering already exists for this course, section and faculty."
                );
            }
        }

        offering.setCourseId(
                request.getCourseId()
        );

        offering.setSectionId(
                request.getSectionId()
        );

        offering.setFacultyId(
                request.getFacultyId()
        );

        offering.setOfferingStatus(
                request.getOfferingStatus()
        );

        CourseOffering updatedOffering =
                courseOfferingRepository.save(offering);

        return toResponse(updatedOffering);
    }

    // =========================================================
    // DELETE OFFERING
    // =========================================================

    public void deleteOffering(Long id) {

        if (!courseOfferingRepository.existsById(id)) {

            throw new RuntimeException(
                    "Course offering not found with id: " + id
            );
        }

        courseOfferingRepository.deleteById(id);
    }

    // =========================================================
    // CONVERT ENTITY TO RESPONSE
    // =========================================================

    private CourseOfferingResponse toResponse(
            CourseOffering offering) {

        // -------------------------------
        // COURSE
        // -------------------------------

        Course course =
                courseRepository
                        .findById(offering.getCourseId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found with id: "
                                                + offering.getCourseId()
                                ));

        // -------------------------------
        // SECTION
        // -------------------------------

        Section section =
                sectionRepository
                        .findById(offering.getSectionId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Section not found with id: "
                                                + offering.getSectionId()
                                ));

        // -------------------------------
        // FACULTY
        // -------------------------------

        Faculty faculty =
                facultyRepository
                        .findById(offering.getFacultyId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found with id: "
                                                + offering.getFacultyId()
                                ));

        // -------------------------------
        // FACULTY NAME
        // -------------------------------

        String facultyName =
                faculty.getFirstName();

        if (faculty.getLastName() != null
                && !faculty.getLastName().isBlank()) {

            facultyName +=
                    " " + faculty.getLastName();
        }

        // -------------------------------
        // RESPONSE
        // -------------------------------

        return new CourseOfferingResponse(

                offering.getOfferingId(),

                course.getCourseId(),
                course.getCourseCode(),
                course.getCourseName(),

                section.getSectionId(),
                section.getSectionName(),

                faculty.getFacultyId(),
                facultyName,

                offering.getOfferingStatus()
        );
    }
}