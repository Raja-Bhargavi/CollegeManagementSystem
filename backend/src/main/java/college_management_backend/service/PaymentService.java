package college_management_backend.service;

import college_management_backend.dto.PaymentRequest;
import college_management_backend.dto.PaymentResponse;
import college_management_backend.entity.Payment;
import college_management_backend.repository.FeeRepository;
import college_management_backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FeeRepository feeRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            FeeRepository feeRepository) {

        this.paymentRepository = paymentRepository;
        this.feeRepository = feeRepository;
    }

    public List<PaymentResponse> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(PaymentResponse::new)
                .toList();
    }

    public PaymentResponse getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + paymentId));

        return new PaymentResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByFee(Long feeId) {

        return paymentRepository.findByFeeId(feeId)
                .stream()
                .map(PaymentResponse::new)
                .toList();
    }

    public List<PaymentResponse> getPaymentsByStatus(
            String paymentStatus) {

        return paymentRepository.findByPaymentStatus(paymentStatus)
                .stream()
                .map(PaymentResponse::new)
                .toList();
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {

        if (!feeRepository.existsById(request.getFeeId())) {
            throw new RuntimeException(
                    "Fee not found with ID: " + request.getFeeId());
        }

        if (request.getTransactionReference() != null
                && !request.getTransactionReference().isBlank()
                && paymentRepository.existsByTransactionReference(
                        request.getTransactionReference())) {

            throw new RuntimeException(
                    "Payment with transaction reference already exists");
        }

        Payment payment = new Payment();

        payment.setFeeId(request.getFeeId());
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionReference(
                request.getTransactionReference());
        payment.setPaymentStatus(request.getPaymentStatus());

        return new PaymentResponse(
                paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse updatePayment(
            Long paymentId,
            PaymentRequest request) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + paymentId));

        if (!feeRepository.existsById(request.getFeeId())) {
            throw new RuntimeException(
                    "Fee not found with ID: " + request.getFeeId());
        }

        if (request.getTransactionReference() != null
                && !request.getTransactionReference().isBlank()
                && paymentRepository
                .existsByTransactionReferenceAndPaymentIdNot(
                        request.getTransactionReference(),
                        paymentId)) {

            throw new RuntimeException(
                    "Another payment already uses this transaction reference");
        }

        payment.setFeeId(request.getFeeId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionReference(
                request.getTransactionReference());
        payment.setPaymentStatus(request.getPaymentStatus());

        return new PaymentResponse(
                paymentRepository.save(payment));
    }

    @Transactional
    public void deletePayment(Long paymentId) {

        if (!paymentRepository.existsById(paymentId)) {
            throw new RuntimeException(
                    "Payment not found with ID: " + paymentId);
        }

        paymentRepository.deleteById(paymentId);
    }
}
