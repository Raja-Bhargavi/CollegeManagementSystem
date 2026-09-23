package college_management_backend.controller;

import college_management_backend.dto.ResultRequest;
import college_management_backend.dto.ResultResponse;
import college_management_backend.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<ResultResponse> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{resultId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResultResponse getResultById(
            @PathVariable Long resultId) {

        return resultService.getResultById(resultId);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<ResultResponse> getResultsByStudent(
            @PathVariable Long studentId) {

        return resultService.getResultsByStudent(studentId);
    }

    @GetMapping("/semester/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<ResultResponse> getResultsBySemester(
            @PathVariable Long semesterId) {

        return resultService.getResultsBySemester(semesterId);
    }

    @PostMapping("/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<String> publishResult(
            @Valid @RequestBody ResultRequest request) {

        resultService.publishResult(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Student result published successfully");
    }

    @PutMapping("/{resultId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<ResultResponse> updateResult(
            @PathVariable Long resultId,
            @Valid @RequestBody ResultRequest request) {

        return ResponseEntity.ok(
                resultService.updateResult(resultId, request));
    }

    @DeleteMapping("/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long resultId) {

        resultService.deleteResult(resultId);

        return ResponseEntity.noContent().build();
    }
}