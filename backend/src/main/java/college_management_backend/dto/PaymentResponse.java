package college_management_backend.dto;

import college_management_backend.entity.Payment;

import java.time.LocalDateTime;

public class PaymentResponse {

    private Long paymentId;
    private Long feeId;
    private Double amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String transactionReference;
    private String paymentStatus;

    public PaymentResponse(Payment payment) {
        this.paymentId = payment.getPaymentId();
        this.feeId = payment.getFeeId();
        this.amount = payment.getAmount();
        this.paymentDate = payment.getPaymentDate();
        this.paymentMethod = payment.getPaymentMethod();
        this.transactionReference = payment.getTransactionReference();
        this.paymentStatus = payment.getPaymentStatus();
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public Long getFeeId() {
        return feeId;
    }

    public Double getAmount() {
        return amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }
}