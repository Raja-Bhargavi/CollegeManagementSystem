package college_management_backend.service;

import college_management_backend.dto.ExaminationRequest;
import college_management_backend.dto.ExaminationResponse;
import college_management_backend.entity.Examination;
import college_management_backend.repository.ExaminationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExaminationService {

    private final ExaminationRepository examinationRepository;

    public ExaminationService(
            ExaminationRepository examinationRepository) {

        this.examinationRepository = examinationRepository;
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

    public ExaminationResponse createExamination(
            ExaminationRequest request) {

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