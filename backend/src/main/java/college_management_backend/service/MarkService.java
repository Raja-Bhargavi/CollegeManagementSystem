package college_management_backend.service;

import college_management_backend.dto.FacultyMarkUpdateRequest;
import college_management_backend.dto.MarkRequest;
import college_management_backend.dto.MarkResponse;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.Examination;
import college_management_backend.entity.Mark;
import college_management_backend.entity.Student;
import college_management_backend.exception.DuplicateMarkException;
import college_management_backend.exception.InvalidMarksException;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.ExaminationRepository;
import college_management_backend.repository.MarkRepository;
import college_management_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarkService {

    private final MarkRepository markRepository;
    private final ExaminationRepository examinationRepository;
    private final StudentRepository studentRepository;
    private final CourseOfferingRepository courseOfferingRepository;

    public MarkService(
            MarkRepository markRepository,
            ExaminationRepository examinationRepository,
            StudentRepository studentRepository,
            CourseOfferingRepository courseOfferingRepository) {

        this.markRepository = markRepository;
        this.examinationRepository = examinationRepository;
        this.studentRepository = studentRepository;
        this.courseOfferingRepository = courseOfferingRepository;
    }

    // =========================================================
    // GET ALL MARKS
    // =========================================================

    public List<MarkResponse> getAllMarks() {

        return markRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET MARK BY ID
    // =========================================================

    public MarkResponse getMarkById(
            Long markId) {

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

    // =========================================================
    // GET MARKS BY EXAM
    // =========================================================

    public List<MarkResponse> getMarksByExam(
            Long examId) {

        return markRepository
                .findByExamId(examId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET MARKS BY STUDENT
    // =========================================================

    public List<MarkResponse> getMarksByStudent(
            Long studentId) {

        return markRepository
                .findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // FACULTY - GET OWN MARKS
    // =========================================================

    public List<MarkResponse> getMarksByFaculty(
            Long facultyId) {

        System.out.println(
                "================================="
        );

        System.out.println(
                "FACULTY MARKS REQUEST"
        );

        System.out.println(
                "facultyId = " + facultyId
        );

        List<CourseOffering> offerings =
                courseOfferingRepository
                        .findByFacultyId(facultyId);

        System.out.println(
                "Course offerings found = "
                        + offerings.size()
        );

        List<MarkResponse> result =
                new ArrayList<>();

        for (CourseOffering offering : offerings) {

            System.out.println(
                    "Offering ID = "
                            + offering.getOfferingId()
            );

            List<Examination> examinations =
                    examinationRepository
                            .findByOfferingId(
                                    offering.getOfferingId()
                            );

            System.out.println(
                    "Examinations found = "
                            + examinations.size()
            );

            for (Examination examination :
                    examinations) {

                System.out.println(
                        "Exam ID = "
                                + examination.getExamId()
                );

                List<Mark> marks =
                        markRepository.findByExamId(
                                examination.getExamId()
                        );

                System.out.println(
                        "Marks found for exam "
                                + examination.getExamId()
                                + " = "
                                + marks.size()
                );

                for (Mark mark : marks) {

                    System.out.println(
                            "Mark ID = "
                                    + mark.getMarkId()
                                    + ", Student ID = "
                                    + mark.getStudentId()
                                    + ", Marks = "
                                    + mark.getMarksObtained()
                    );

                    result.add(
                            toResponse(mark)
                    );
                }
            }
        }

        System.out.println(
                "FINAL FACULTY MARK COUNT = "
                        + result.size()
        );

        System.out.println(
                "================================="
        );

        return result;
    }

    // =========================================================
    // ADMIN / STAFF - CREATE MARK
    // =========================================================

    @Transactional
    public MarkResponse createMark(
            MarkRequest request) {

        Examination examination =
                validateExam(
                        request.getExamId()
                );

        validateStudent(
                request.getStudentId()
        );

        if (markRepository
                .existsByExamIdAndStudentId(
                        request.getExamId(),
                        request.getStudentId()
                )) {

            throw new DuplicateMarkException(
                    "Marks already exist for this student and examination"
            );
        }

        validateMarks(
                request.getMarksObtained(),
                examination.getMaximumMarks()
        );

        Mark mark =
                new Mark();

        mark.setExamId(
                request.getExamId()
        );

        mark.setStudentId(
                request.getStudentId()
        );

        mark.setMarksObtained(
                request.getMarksObtained()
        );

        mark.setRemarks(
                request.getRemarks()
        );

        Mark savedMark =
                markRepository.save(mark);

        return toResponse(
                savedMark
        );
    }

    // =========================================================
    // ADMIN / STAFF - UPDATE MARK
    // =========================================================

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
                validateExam(
                        request.getExamId()
                );

        validateStudent(
                request.getStudentId()
        );

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

        mark.setExamId(
                request.getExamId()
        );

        mark.setStudentId(
                request.getStudentId()
        );

        mark.setMarksObtained(
                request.getMarksObtained()
        );

        mark.setRemarks(
                request.getRemarks()
        );

        Mark updatedMark =
                markRepository.save(mark);

        return toResponse(
                updatedMark
        );
    }

    // =========================================================
    // FACULTY - UPDATE OWN MARK
    // =========================================================

    @Transactional
    public MarkResponse updateMarkByFaculty(
            Long markId,
            FacultyMarkUpdateRequest request,
            Long facultyId) {

        Mark mark =
                markRepository.findById(markId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Mark not found with ID: "
                                                + markId
                                )
                        );

        Examination examination =
                examinationRepository.findById(
                        mark.getExamId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Examination not found with ID: "
                                        + mark.getExamId()
                        )
                );

        CourseOffering offering =
                courseOfferingRepository.findById(
                        examination.getOfferingId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course offering not found with ID: "
                                        + examination.getOfferingId()
                        )
                );

        // -----------------------------------------------------
        // SECURITY CHECK
        // -----------------------------------------------------

        if (!facultyId.equals(
                offering.getFacultyId())) {

            throw new RuntimeException(
                    "You are not authorized to update marks "
                            + "for this examination"
            );
        }

        // -----------------------------------------------------
        // Validate marks against maximum marks
        // -----------------------------------------------------

        validateMarks(
                request.getMarksObtained(),
                examination.getMaximumMarks()
        );

        // -----------------------------------------------------
        // Update ONLY editable fields
        //
        // examId and studentId are deliberately not changed.
        // -----------------------------------------------------

        mark.setMarksObtained(
                request.getMarksObtained()
        );

        mark.setRemarks(
                request.getRemarks()
        );

        Mark updatedMark =
                markRepository.save(mark);

        return toResponse(
                updatedMark
        );
    }

    // =========================================================
    // ADMIN - DELETE MARK
    // =========================================================

    @Transactional
    public void deleteMark(
            Long markId) {

        if (!markRepository.existsById(
                markId)) {

            throw new RuntimeException(
                    "Mark not found with ID: "
                            + markId
            );
        }

        markRepository.deleteById(
                markId
        );
    }

    // =========================================================
    // VALIDATE EXAM
    // =========================================================

    private Examination validateExam(
            Long examId) {

        return examinationRepository
                .findById(examId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Examination not found with ID: "
                                        + examId
                        )
                );
    }

    // =========================================================
    // VALIDATE STUDENT
    // =========================================================

    private void validateStudent(
            Long studentId) {

        studentRepository.findById(
                studentId
        )
        .orElseThrow(() ->
                new RuntimeException(
                        "Student not found with ID: "
                                + studentId
                )
        );
    }

    // =========================================================
    // VALIDATE MARKS
    // =========================================================

    private void validateMarks(
            Double marksObtained,
            Double maximumMarks) {

        if (marksObtained == null
                || marksObtained < 0) {

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

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private MarkResponse toResponse(
            Mark mark) {

        Examination examination =
                examinationRepository
                        .findById(
                                mark.getExamId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Examination not found with ID: "
                                                + mark.getExamId()
                                )
                        );

        Student student =
                studentRepository
                        .findById(
                                mark.getStudentId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found with ID: "
                                                + mark.getStudentId()
                                )
                        );

        String studentName =
                student.getFirstName()
                        + " "
                        + student.getLastName();

        return new MarkResponse(
                mark.getMarkId(),
                mark.getExamId(),
                examination.getExamType(),
                mark.getStudentId(),
                studentName,
                mark.getMarksObtained(),
                mark.getRemarks()
        );
    }
}