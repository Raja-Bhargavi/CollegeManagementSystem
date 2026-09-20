package college_management_backend.controller;

import college_management_backend.dto.ResultRequest;
import college_management_backend.dto.ResultResponse;
import college_management_backend.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
    public List<ResultResponse> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{resultId}")
    public ResultResponse getResultById(
            @PathVariable Long resultId) {

        return resultService.getResultById(resultId);
    }

    @GetMapping("/student/{studentId}")
    public List<ResultResponse> getResultsByStudent(
            @PathVariable Long studentId) {

        return resultService.getResultsByStudent(studentId);
    }

    @GetMapping("/semester/{semesterId}")
    public List<ResultResponse> getResultsBySemester(
            @PathVariable Long semesterId) {

        return resultService.getResultsBySemester(semesterId);
    }

    @PostMapping("/publish")
    public ResponseEntity<String> publishResult(
            @Valid @RequestBody ResultRequest request) {

        resultService.publishResult(request);

        return ResponseEntity.ok(
                "Student result published successfully");
    }
}
