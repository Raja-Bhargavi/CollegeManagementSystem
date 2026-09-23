package college_management_backend.service;

import college_management_backend.dto.MarkRequest;
import college_management_backend.dto.MarkResponse;
import college_management_backend.entity.Examination;
import college_management_backend.entity.Mark;
import college_management_backend.entity.Student;
import college_management_backend.exception.DuplicateMarkException;
import college_management_backend.exception.InvalidMarksException;
import college_management_backend.repository.ExaminationRepository;
import college_management_backend.repository.MarkRepository;
import college_management_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarkService {

    private final MarkRepository markRepository;
    private final ExaminationRepository examinationRepository;
    private final StudentRepository studentRepository;

    public MarkService(
            MarkRepository markRepository,
            ExaminationRepository examinationRepository,
            StudentRepository studentRepository) {

        this.markRepository = markRepository;
        this.examinationRepository = examinationRepository;
        this.studentRepository = studentRepository;
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

    public List<MarkResponse> getMarksByExam(Long examId) {

        return markRepository
                .findByExamId(examId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<MarkResponse> getMarksByStudent(Long studentId) {

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
                validateExam(request.getExamId());

        validateStudent(request.getStudentId());

        if (markRepository.existsByExamIdAndStudentId(
                request.getExamId(),
                request.getStudentId())) {

            throw new DuplicateMarkException(
                    "Marks already exist for this student and examination"
            );
        }

        validateMarks(
                request.getMarksObtained(),
                examination.getMaximumMarks()
        );

        Mark mark = new Mark();

        mark.setExamId(request.getExamId());
        mark.setStudentId(request.getStudentId());
        mark.setMarksObtained(request.getMarksObtained());
        mark.setRemarks(request.getRemarks());

        Mark savedMark =
                markRepository.save(mark);

        return toResponse(savedMark);
    }

    @Transactional
    public MarkResponse updateMark(
            Long markId,
            MarkRequest request) {

        Mark mark =
                markRepository.findById(markId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mark not found with ID: "
                                                + markId
                                )
                        );

        Examination examination =
                validateExam(request.getExamId());

        validateStudent(request.getStudentId());

        boolean duplicate =
                markRepository
                        .existsByExamIdAndStudentIdAndMarkIdNot(
                                request.getExamId(),
                                request.getStudentId(),
                                markId
                        );

        if (duplicate) {

            throw new DuplicateMarkException(
                    "Marks already exist for this student and examination"
            );
        }

        validateMarks(
                request.getMarksObtained(),
                examination.getMaximumMarks()
        );

        mark.setExamId(request.getExamId());
        mark.setStudentId(request.getStudentId());
        mark.setMarksObtained(request.getMarksObtained());
        mark.setRemarks(request.getRemarks());

        Mark updatedMark =
                markRepository.save(mark);

        return toResponse(updatedMark);
    }

    @Transactional
    public void deleteMark(Long markId) {

        if (!markRepository.existsById(markId)) {

            throw new RuntimeException(
                    "Mark not found with ID: "
                            + markId
            );
        }

        markRepository.deleteById(markId);
    }

    private Examination validateExam(Long examId) {

        return examinationRepository
                .findById(examId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Examination not found with ID: "
                                        + examId
                        )
                );
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
    }

    private void validateMarks(
            Double marksObtained,
            Double maximumMarks) {

        if (marksObtained == null || marksObtained < 0) {

            throw new InvalidMarksException(
                    "Marks cannot be negative"
            );
        }

        if (marksObtained > maximumMarks) {

            throw new InvalidMarksException(
                    "Marks obtained cannot exceed maximum marks of "
                            + maximumMarks
            );
        }
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