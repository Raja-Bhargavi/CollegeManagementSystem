package college_management_backend.controller;

import college_management_backend.dto.FeeRequest;
import college_management_backend.dto.FeeResponse;
import college_management_backend.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<FeeResponse> getAllFees() {
        return feeService.getAllFees();
    }

    @GetMapping("/{feeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public FeeResponse getFeeById(
            @PathVariable Long feeId) {

        return feeService.getFeeById(feeId);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<FeeResponse> getFeesByStudent(
            @PathVariable Long studentId) {

        return feeService.getFeesByStudent(studentId);
    }

    @GetMapping("/semester/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<FeeResponse> getFeesBySemester(
            @PathVariable Long semesterId) {

        return feeService.getFeesBySemester(semesterId);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<FeeResponse> getFeesByStatus(
            @PathVariable String status) {

        return feeService.getFeesByStatus(status);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FeeResponse> createFee(
            @Valid @RequestBody FeeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(feeService.createFee(request));
    }

    @PutMapping("/{feeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<FeeResponse> updateFee(
            @PathVariable Long feeId,
            @Valid @RequestBody FeeRequest request) {

        return ResponseEntity.ok(
                feeService.updateFee(feeId, request));
    }

    @DeleteMapping("/{feeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFee(
            @PathVariable Long feeId) {

        feeService.deleteFee(feeId);

        return ResponseEntity.noContent().build();
    }
}