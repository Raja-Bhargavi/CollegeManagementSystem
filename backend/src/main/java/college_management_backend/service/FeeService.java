package college_management_backend.service;

import college_management_backend.dto.FeeRequest;
import college_management_backend.dto.FeeResponse;
import college_management_backend.entity.Fee;
import college_management_backend.repository.FeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeeService {

    private final FeeRepository feeRepository;

    public FeeService(FeeRepository feeRepository) {
        this.feeRepository = feeRepository;
    }

    public List<FeeResponse> getAllFees() {

        return feeRepository.findAll()
                .stream()
                .map(FeeResponse::new)
                .toList();
    }

    public FeeResponse getFeeById(Long feeId) {

        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fee not found with ID: " + feeId));

        return new FeeResponse(fee);
    }

    public List<FeeResponse> getFeesByStudent(Long studentId) {

        return feeRepository.findByStudentId(studentId)
                .stream()
                .map(FeeResponse::new)
                .toList();
    }

    public List<FeeResponse> getFeesBySemester(Long semesterId) {

        return feeRepository.findBySemesterId(semesterId)
                .stream()
                .map(FeeResponse::new)
                .toList();
    }

    public List<FeeResponse> getFeesByStatus(String status) {

        return feeRepository.findByStatus(status)
                .stream()
                .map(FeeResponse::new)
                .toList();
    }

    @Transactional
    public FeeResponse createFee(FeeRequest request) {

        boolean duplicate =
                feeRepository.existsByStudentIdAndSemesterIdAndFeeType(
                        request.getStudentId(),
                        request.getSemesterId(),
                        request.getFeeType()
                );

        if (duplicate) {
            throw new RuntimeException(
                    "Fee already exists for this student, semester and fee type");
        }

        Fee fee = new Fee();

        fee.setStudentId(request.getStudentId());
        fee.setSemesterId(request.getSemesterId());
        fee.setFeeType(request.getFeeType());
        fee.setAmount(request.getAmount());
        fee.setDueDate(request.getDueDate());
        fee.setStatus(request.getStatus());

        return new FeeResponse(feeRepository.save(fee));
    }

    @Transactional
    public FeeResponse updateFee(
            Long feeId,
            FeeRequest request) {

        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Fee not found with ID: " + feeId));

        boolean duplicate =
                feeRepository
                        .existsByStudentIdAndSemesterIdAndFeeTypeAndFeeIdNot(
                                request.getStudentId(),
                                request.getSemesterId(),
                                request.getFeeType(),
                                feeId
                        );

        if (duplicate) {
            throw new RuntimeException(
                    "Another fee already exists for this student, semester and fee type");
        }

        fee.setStudentId(request.getStudentId());
        fee.setSemesterId(request.getSemesterId());
        fee.setFeeType(request.getFeeType());
        fee.setAmount(request.getAmount());
        fee.setDueDate(request.getDueDate());
        fee.setStatus(request.getStatus());

        return new FeeResponse(feeRepository.save(fee));
    }

    @Transactional
    public void deleteFee(Long feeId) {

        if (!feeRepository.existsById(feeId)) {
            throw new RuntimeException(
                    "Fee not found with ID: " + feeId);
        }

        feeRepository.deleteById(feeId);
    }
}