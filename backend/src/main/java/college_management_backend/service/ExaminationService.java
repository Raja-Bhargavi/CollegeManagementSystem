package college_management_backend.service;

import college_management_backend.dto.ExaminationRequest;
import college_management_backend.dto.ExaminationResponse;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.Examination;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.ExaminationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExaminationService {

    private final ExaminationRepository examinationRepository;
    private final CourseOfferingRepository courseOfferingRepository;

    public ExaminationService(
            ExaminationRepository examinationRepository,
            CourseOfferingRepository courseOfferingRepository) {

        this.examinationRepository = examinationRepository;
        this.courseOfferingRepository = courseOfferingRepository;
    }

    public List<ExaminationResponse> getAllExaminations() {

        return examinationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ExaminationResponse getExaminationById(Long examId) {

        Examination examination =
                examinationRepository.findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Examination not found with ID: "
                                                + examId
                                )
                        );

        return toResponse(examination);
    }

    public List<ExaminationResponse> getExaminationsByOffering(
            Long offeringId) {

        return examinationRepository
                .findByOfferingId(offeringId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExaminationResponse createExamination(
            ExaminationRequest request) {

        validateOffering(request.getOfferingId());

        if (examinationRepository
                .existsByOfferingIdAndExamTypeAndExamDate(
                        request.getOfferingId(),
                        request.getExamType(),
                        request.getExamDate())) {

            throw new RuntimeException(
                    "An examination of this type is already scheduled "
                            + "for this offering on this date"
            );
        }

        Examination examination = new Examination();

        examination.setOfferingId(request.getOfferingId());
        examination.setExamType(request.getExamType());
        examination.setExamDate(request.getExamDate());
        examination.setMaximumMarks(request.getMaximumMarks());
        examination.setStatus(request.getStatus());

        Examination saved =
                examinationRepository.save(examination);

        return toResponse(saved);
    }

    @Transactional
    public ExaminationResponse updateExamination(
            Long examId,
            ExaminationRequest request) {

        Examination examination =
                examinationRepository.findById(examId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Examination not found with ID: "
                                                + examId
                                )
                        );

        validateOffering(request.getOfferingId());

        boolean duplicate =
                examinationRepository
                        .existsByOfferingIdAndExamTypeAndExamDateAndExamIdNot(
                                request.getOfferingId(),
                                request.getExamType(),
                                request.getExamDate(),
                                examId
                        );

        if (duplicate) {
            throw new RuntimeException(
                    "An examination of this type is already scheduled "
                            + "for this offering on this date"
            );
        }

        examination.setOfferingId(request.getOfferingId());
        examination.setExamType(request.getExamType());
        examination.setExamDate(request.getExamDate());
        examination.setMaximumMarks(request.getMaximumMarks());
        examination.setStatus(request.getStatus());

        Examination updated =
                examinationRepository.save(examination);

        return toResponse(updated);
    }

    @Transactional
    public void deleteExamination(Long examId) {

        if (!examinationRepository.existsById(examId)) {

            throw new RuntimeException(
                    "Examination not found with ID: "
                            + examId
            );
        }

        examinationRepository.deleteById(examId);
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
                    "Examination can only be created for an ACTIVE course offering"
            );
        }
    }

    private ExaminationResponse toResponse(
            Examination examination) {

        return new ExaminationResponse(
                examination.getExamId(),
                examination.getOfferingId(),
                examination.getExamType(),
                examination.getExamDate(),
                examination.getMaximumMarks(),
                examination.getStatus()
        );
    }
}