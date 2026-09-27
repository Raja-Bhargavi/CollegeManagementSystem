package college_management_backend.service;

import college_management_backend.dto.CourseOfferingRequest;
import college_management_backend.dto.CourseOfferingResponse;
import college_management_backend.entity.CourseOffering;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.CourseRepository;
import college_management_backend.repository.FacultyRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;

    public CourseOfferingService(
            CourseOfferingRepository courseOfferingRepository,
            CourseRepository courseRepository,
            FacultyRepository facultyRepository) {

        this.courseOfferingRepository = courseOfferingRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<CourseOfferingResponse> getAllOfferings() {

        return courseOfferingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CourseOfferingResponse getOfferingById(Long offeringId) {

        CourseOffering offering =
                courseOfferingRepository.findById(offeringId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + offeringId
                                ));

        return toResponse(offering);
    }

    @Transactional
    public CourseOfferingResponse createOffering(
            CourseOfferingRequest request) {

        validateRequest(request);

        if (!courseRepository.existsById(request.getCourseId())) {
            throw new RuntimeException(
                    "Course not found with ID: "
                            + request.getCourseId()
            );
        }

        if (!facultyRepository.existsById(request.getFacultyId())) {
            throw new RuntimeException(
                    "Faculty not found with ID: "
                            + request.getFacultyId()
            );
        }

        if (courseOfferingRepository
                .existsByCourseIdAndSectionIdAndFacultyId(
                        request.getCourseId(),
                        request.getSectionId(),
                        request.getFacultyId())) {

            throw new RuntimeException(
                    "This course is already offered for the selected "
                            + "section and faculty"
            );
        }

        CourseOffering offering = new CourseOffering();

        offering.setCourseId(request.getCourseId());
        offering.setSectionId(request.getSectionId());
        offering.setFacultyId(request.getFacultyId());
        offering.setOfferingStatus(
                request.getOfferingStatus().trim()
        );

        CourseOffering savedOffering =
                courseOfferingRepository.save(offering);

        return toResponse(savedOffering);
    }

    @Transactional
    public CourseOfferingResponse updateOffering(
            Long offeringId,
            CourseOfferingRequest request) {

        validateRequest(request);

        CourseOffering offering =
                courseOfferingRepository.findById(offeringId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + offeringId
                                ));

        if (!courseRepository.existsById(request.getCourseId())) {
            throw new RuntimeException(
                    "Course not found with ID: "
                            + request.getCourseId()
            );
        }

        if (!facultyRepository.existsById(request.getFacultyId())) {
            throw new RuntimeException(
                    "Faculty not found with ID: "
                            + request.getFacultyId()
            );
        }

        boolean combinationChanged =
                !offering.getCourseId().equals(request.getCourseId())
                        || !offering.getSectionId().equals(request.getSectionId())
                        || !offering.getFacultyId().equals(request.getFacultyId());

        if (combinationChanged
                && courseOfferingRepository
                .existsByCourseIdAndSectionIdAndFacultyId(
                        request.getCourseId(),
                        request.getSectionId(),
                        request.getFacultyId())) {

            throw new RuntimeException(
                    "Another course offering already exists "
                            + "for the selected course, section and faculty"
            );
        }

        offering.setCourseId(request.getCourseId());
        offering.setSectionId(request.getSectionId());
        offering.setFacultyId(request.getFacultyId());
        offering.setOfferingStatus(
                request.getOfferingStatus().trim()
        );

        CourseOffering updatedOffering =
                courseOfferingRepository.save(offering);

        return toResponse(updatedOffering);
    }

    @Transactional
    public void deleteOffering(Long offeringId) {

        CourseOffering offering =
                courseOfferingRepository.findById(offeringId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + offeringId
                                ));

        courseOfferingRepository.delete(offering);
    }

    private void validateRequest(
            CourseOfferingRequest request) {

        if (request.getCourseId() == null) {
            throw new RuntimeException(
                    "Course ID is required"
            );
        }

        if (request.getSectionId() == null) {
            throw new RuntimeException(
                    "Section ID is required"
            );
        }

        if (request.getFacultyId() == null) {
            throw new RuntimeException(
                    "Faculty ID is required"
            );
        }

        if (request.getOfferingStatus() == null
                || request.getOfferingStatus().isBlank()) {

            throw new RuntimeException(
                    "Offering status is required"
            );
        }
    }

    private CourseOfferingResponse toResponse(
            CourseOffering offering) {

        return new CourseOfferingResponse(
                offering.getOfferingId(),
                offering.getCourseId(),
                offering.getSectionId(),
                offering.getFacultyId(),
                offering.getOfferingStatus()
        );
    }
}
