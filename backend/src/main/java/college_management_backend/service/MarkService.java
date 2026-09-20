package college_management_backend.service;

import college_management_backend.dto.MarkRequest;
import college_management_backend.dto.MarkResponse;
import college_management_backend.entity.Examination;
import college_management_backend.entity.Mark;
import college_management_backend.exception.InvalidMarksException;
import college_management_backend.exception.DuplicateMarkException;
import college_management_backend.repository.ExaminationRepository;
import college_management_backend.repository.MarkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarkService {

    private final MarkRepository markRepository;
    private final ExaminationRepository examinationRepository;

    public MarkService(
            MarkRepository markRepository,
            ExaminationRepository examinationRepository) {

        this.markRepository = markRepository;
        this.examinationRepository = examinationRepository;
    }

    public List<MarkResponse> getAllMarks() {

        return markRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MarkResponse getMarkById(Long markId) {

        Mark mark =
                markRepository.findById(markId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mark not found with ID: "
                                                + markId
                                )
                        );

        return toResponse(mark);
    }

    public List<MarkResponse> getMarksByExam(
            Long examId) {

        return markRepository
                .findByExamId(examId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MarkResponse> getMarksByStudent(
            Long studentId) {

        return markRepository
                .findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MarkResponse createMark(
            MarkRequest request) {

        Examination examination =
                examinationRepository
                        .findById(request.getExamId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Examination not found with ID: "
                                                + request.getExamId()
                                )
                        );

        if (markRepository.existsByExamIdAndStudentId(
                request.getExamId(),
                request.getStudentId())) {

            throw new DuplicateMarkException(
                    "Marks already exist for this student and examination"
            );
        }

        if (request.getMarksObtained() < 0) {

        throw new InvalidMarksException(
                "Marks cannot be negative"
        );
        }

        if (request.getMarksObtained()
                > examination.getMaximumMarks()) {

        throw new InvalidMarksException(
                "Marks obtained cannot exceed maximum marks of "
                        + examination.getMaximumMarks()
        );
        }

        Mark mark = new Mark();

        mark.setExamId(request.getExamId());
        mark.setStudentId(request.getStudentId());
        mark.setMarksObtained(request.getMarksObtained());
        mark.setRemarks(request.getRemarks());

        Mark savedMark =
                markRepository.save(mark);

        return toResponse(savedMark);
    }

    private MarkResponse toResponse(Mark mark) {

        return new MarkResponse(
                mark.getMarkId(),
                mark.getExamId(),
                mark.getStudentId(),
                mark.getMarksObtained(),
                mark.getRemarks()
        );
    }
}