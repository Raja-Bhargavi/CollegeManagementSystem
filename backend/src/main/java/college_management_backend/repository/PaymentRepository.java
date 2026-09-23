package college_management_backend.repository;

import college_management_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByFeeId(Long feeId);

    List<Payment> findByPaymentStatus(String paymentStatus);

    boolean existsByTransactionReference(String transactionReference);

    boolean existsByTransactionReferenceAndPaymentIdNot(
            String transactionReference,
            Long paymentId
    );
}
