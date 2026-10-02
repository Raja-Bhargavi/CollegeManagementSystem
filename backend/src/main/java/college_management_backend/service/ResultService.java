package college_management_backend.service;

import college_management_backend.dto.FacultyResultUpdateRequest;
import college_management_backend.dto.ResultRequest;
import college_management_backend.dto.ResultResponse;
import college_management_backend.entity.CourseOffering;
import college_management_backend.entity.CourseRegistration;
import college_management_backend.entity.Result;
import college_management_backend.entity.Student;
import college_management_backend.repository.CourseOfferingRepository;
import college_management_backend.repository.CourseRegistrationRepository;
import college_management_backend.repository.ResultRepository;
import college_management_backend.repository.StudentRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ResultService {

    private final ResultRepository resultRepository;

    private final CourseOfferingRepository courseOfferingRepository;

    private final CourseRegistrationRepository courseRegistrationRepository;

    private final StudentRepository studentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ResultService(
            ResultRepository resultRepository,
            CourseOfferingRepository courseOfferingRepository,
            CourseRegistrationRepository courseRegistrationRepository,
            StudentRepository studentRepository) {

        this.resultRepository = resultRepository;

        this.courseOfferingRepository =
                courseOfferingRepository;

        this.courseRegistrationRepository =
                courseRegistrationRepository;

        this.studentRepository =
                studentRepository;
    }

    public List<ResultResponse> getAllResults() {

        return resultRepository.findAll()
                .stream()
                .map(ResultResponse::new)
                .toList();
    }

    public ResultResponse getResultById(Long resultId) {

        Result result =
                resultRepository.findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found with ID: "
                                                + resultId
                                )
                        );

        return new ResultResponse(result);
    }

    public List<ResultResponse> getResultsByStudent(
            Long studentId) {

        return resultRepository
                .findByStudentId(studentId)
                .stream()
                .map(ResultResponse::new)
                .toList();
    }

    public List<ResultResponse> getResultsBySemester(
            Long semesterId) {

        return resultRepository
                .findBySemesterId(semesterId)
                .stream()
                .map(ResultResponse::new)
                .toList();
    }

    /**
     * Returns results for students who are registered
     * in courses assigned to the given faculty.
     */
    public List<ResultResponse> getResultsByFaculty(
            Long facultyId) {

        List<CourseOffering> offerings =
                courseOfferingRepository
                        .findByFacultyId(facultyId);

        Set<Long> studentIds =
                new HashSet<>();

        for (CourseOffering offering : offerings) {

            List<CourseRegistration> registrations =
                    courseRegistrationRepository
                            .findByOfferingId(
                                    offering.getOfferingId()
                            );

            for (CourseRegistration registration
                    : registrations) {

                if ("REGISTERED".equalsIgnoreCase(
                        registration.getStatus())) {

                    studentIds.add(
                            registration.getStudentId()
                    );
                }
            }
        }

        List<ResultResponse> results =
                new ArrayList<>();

        for (Long studentId : studentIds) {

            List<Result> studentResults =
                    resultRepository
                            .findByStudentId(studentId);

            Student student =
                    studentRepository
                            .findById(studentId)
                            .orElse(null);

            String studentName = "";

            if (student != null) {

                studentName =
                        student.getFirstName()
                                + " "
                                + student.getLastName();
            }

            for (Result result : studentResults) {

                results.add(
                        new ResultResponse(
                                result,
                                studentName
                        )
                );
            }
        }

        return results;
    }

    /**
     * Faculty can update only:
     * - SGPA
     * - Remarks
     * - Result Status
     *
     * Student, semester and CGPA cannot be changed
     * through this faculty endpoint.
     */
    @Transactional
    public ResultResponse updateResultByFaculty(
            Long resultId,
            FacultyResultUpdateRequest request,
            Long facultyId) {

        Result result =
                resultRepository.findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found with ID: "
                                                + resultId
                                )
                        );

        boolean facultyOwnsStudent =
                false;

        List<CourseOffering> offerings =
                courseOfferingRepository
                        .findByFacultyId(facultyId);

        for (CourseOffering offering : offerings) {

            List<CourseRegistration> registrations =
                    courseRegistrationRepository
                            .findByOfferingId(
                                    offering.getOfferingId()
                            );

            for (CourseRegistration registration
                    : registrations) {

                if (
                        registration.getStudentId()
                                .equals(result.getStudentId())
                        &&
                        "REGISTERED".equalsIgnoreCase(
                                registration.getStatus())
                ) {

                    facultyOwnsStudent = true;

                    break;
                }
            }

            if (facultyOwnsStudent) {
                break;
            }
        }

        if (!facultyOwnsStudent) {

            throw new RuntimeException(
                    "You are not authorized to update this result"
            );
        }

        if (request.getSgpa() == null) {

            throw new RuntimeException(
                    "SGPA is required"
            );
        }

        if (
                request.getSgpa() < 0.0
                        ||
                request.getSgpa() > 10.0
        ) {

            throw new RuntimeException(
                    "SGPA must be between 0 and 10"
            );
        }

        if (request.getResultStatus() == null
                || request.getResultStatus()
                .trim()
                .isEmpty()) {

            throw new RuntimeException(
                    "Result status is required"
            );
        }

        String status =
                request.getResultStatus()
                        .trim()
                        .toUpperCase();

        if (
                !status.equals("PENDING")
                        &&
                !status.equals("PUBLISHED")
        ) {

            throw new RuntimeException(
                    "Result status must be PENDING or PUBLISHED"
            );
        }

        result.setSgpa(
                request.getSgpa()
        );

        result.setRemarks(
                request.getRemarks()
        );

        result.setResultStatus(
                status
        );

        return new ResultResponse(
                resultRepository.save(result)
        );
    }

    @Transactional
    public void publishResult(
            ResultRequest request) {

        if (resultRepository
                .existsByStudentIdAndSemesterId(
                        request.getStudentId(),
                        request.getSemesterId())) {

            throw new RuntimeException(
                    "Result already exists for this student and semester"
            );
        }

        entityManager
                .createNativeQuery(
                        "CALL publish_student_result(:studentId, :semesterId, :sgpa, :cgpa)"
                )
                .setParameter(
                        "studentId",
                        request.getStudentId()
                )
                .setParameter(
                        "semesterId",
                        request.getSemesterId()
                )
                .setParameter(
                        "sgpa",
                        request.getSgpa()
                )
                .setParameter(
                        "cgpa",
                        request.getCgpa()
                )
                .executeUpdate();
    }

    @Transactional
    public ResultResponse updateResult(
            Long resultId,
            ResultRequest request) {

        Result result =
                resultRepository
                        .findById(resultId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Result not found with ID: "
                                                + resultId
                                )
                        );

        boolean duplicate =
                resultRepository
                        .existsByStudentIdAndSemesterIdAndResultIdNot(
                                request.getStudentId(),
                                request.getSemesterId(),
                                resultId
                        );

        if (duplicate) {

            throw new RuntimeException(
                    "Another result already exists for this student and semester"
            );
        }

        result.setStudentId(
                request.getStudentId()
        );

        result.setSemesterId(
                request.getSemesterId()
        );

        result.setSgpa(
                request.getSgpa()
        );

        result.setCgpa(
                request.getCgpa()
        );

        return new ResultResponse(
                resultRepository.save(result)
        );
    }

    @Transactional
    public void deleteResult(Long resultId) {

        if (!resultRepository.existsById(resultId)) {

            throw new RuntimeException(
                    "Result not found with ID: "
                            + resultId
            );
        }

        resultRepository.deleteById(resultId);
    }
}