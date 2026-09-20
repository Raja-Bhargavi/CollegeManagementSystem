package college_management_backend.service;

import college_management_backend.dto.ResultRequest;
import college_management_backend.dto.ResultResponse;
import college_management_backend.entity.Result;
import college_management_backend.repository.ResultRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ResultService(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    public List<ResultResponse> getAllResults() {

        return resultRepository.findAll()
                .stream()
                .map(ResultResponse::new)
                .toList();
    }

    public ResultResponse getResultById(Long resultId) {

        Result result = resultRepository.findById(resultId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Result not found with ID: " + resultId));

        return new ResultResponse(result);
    }

    public List<ResultResponse> getResultsByStudent(Long studentId) {

        return resultRepository.findByStudentId(studentId)
                .stream()
                .map(ResultResponse::new)
                .toList();
    }

    public List<ResultResponse> getResultsBySemester(Long semesterId) {

        return resultRepository.findBySemesterId(semesterId)
                .stream()
                .map(ResultResponse::new)
                .toList();
    }

    @Transactional
    public void publishResult(ResultRequest request) {

        entityManager
                .createNativeQuery(
                        "CALL publish_student_result(:studentId, :semesterId, :sgpa, :cgpa)")
                .setParameter("studentId", request.getStudentId())
                .setParameter("semesterId", request.getSemesterId())
                .setParameter("sgpa", request.getSgpa())
                .setParameter("cgpa", request.getCgpa())
                .executeUpdate();
    }
}