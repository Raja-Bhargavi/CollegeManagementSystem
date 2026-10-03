package college_management_backend.controller;

import college_management_backend.dto.PaymentRequest;
import college_management_backend.dto.PaymentResponse;
import college_management_backend.entity.Fee;
import college_management_backend.repository.FeeRepository;
import college_management_backend.service.PaymentService;
import college_management_backend.service.StudentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;
    private final StudentService studentService;
    private final FeeRepository feeRepository;

    public PaymentController(
            PaymentService paymentService,
            StudentService studentService,
            FeeRepository feeRepository) {

        this.paymentService = paymentService;
        this.studentService = studentService;
        this.feeRepository = feeRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public List<PaymentResponse> getAllPayments() {

        return paymentService.getAllPayments();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<PaymentResponse> getMyPayments(
            Authentication authentication) {

        Long studentId =
                studentService
                        .getStudentByUsername(authentication.getName())
                        .getStudentId();

        List<Fee> fees =
                feeRepository.findByStudentId(studentId);

        List<PaymentResponse> result =
                new ArrayList<>();

        for (Fee fee : fees) {

            result.addAll(
                    paymentService
                            .getPaymentsByFee(fee.getFeeId())
            );
        }

        return result;
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public PaymentResponse getPaymentById(
            @PathVariable Long paymentId) {

        return paymentService.getPaymentById(paymentId);
    }

    @GetMapping("/fee/{feeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public List<PaymentResponse> getPaymentsByFee(
            @PathVariable Long feeId) {

        return paymentService.getPaymentsByFee(feeId);
    }

    @GetMapping("/status/{paymentStatus}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGEMENT')")
    public List<PaymentResponse> getPaymentsByStatus(
            @PathVariable String paymentStatus) {

        return paymentService
                .getPaymentsByStatus(paymentStatus);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.createPayment(request));
    }

    @PutMapping("/{paymentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.updatePayment(
                        paymentId,
                        request
                )
        );
    }

    @DeleteMapping("/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePayment(
            @PathVariable Long paymentId) {

        paymentService.deletePayment(paymentId);

        return ResponseEntity.noContent().build();
    }
}