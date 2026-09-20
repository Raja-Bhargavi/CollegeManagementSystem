package college_management_backend.service;

import college_management_backend.dto.CourseOfferingRequest;
import college_management_backend.dto.CourseOfferingResponse;
import college_management_backend.entity.CourseOffering;
import college_management_backend.repository.CourseOfferingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseOfferingService {

    private final CourseOfferingRepository courseOfferingRepository;

    public CourseOfferingService(
            CourseOfferingRepository courseOfferingRepository) {

        this.courseOfferingRepository = courseOfferingRepository;
    }

    public List<CourseOfferingResponse> getAllOfferings() {

        return courseOfferingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourseOfferingResponse getOfferingById(Long offeringId) {

        CourseOffering offering =
                courseOfferingRepository.findById(offeringId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course offering not found with ID: "
                                                + offeringId
                                )
                        );

        return toResponse(offering);
    }

    @Transactional
    public CourseOfferingResponse createOffering(
            CourseOfferingRequest request) {

        CourseOffering offering = new CourseOffering();

        offering.setCourseId(request.getCourseId());
        offering.setSectionId(request.getSectionId());
        offering.setFacultyId(request.getFacultyId());
        offering.setOfferingStatus(request.getOfferingStatus());

        CourseOffering savedOffering =
                courseOfferingRepository.save(offering);

        return toResponse(savedOffering);
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