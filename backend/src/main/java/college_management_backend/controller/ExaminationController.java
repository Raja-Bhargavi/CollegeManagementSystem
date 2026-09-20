package college_management_backend.controller;

import college_management_backend.dto.ExaminationRequest;
import college_management_backend.dto.ExaminationResponse;
import college_management_backend.service.ExaminationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examinations")
public class ExaminationController {

    private final ExaminationService examinationService;

    public ExaminationController(
            ExaminationService examinationService) {

        this.examinationService = examinationService;
    }

    @GetMapping
    public List<ExaminationResponse> getAllExaminations() {

        return examinationService.getAllExaminations();
    }

    @GetMapping("/{id}")
    public ExaminationResponse getExaminationById(
            @PathVariable Long id) {

        return examinationService.getExaminationById(id);
    }

    @GetMapping("/offering/{offeringId}")
    public List<ExaminationResponse> getExaminationsByOffering(
            @PathVariable Long offeringId) {

        return examinationService
                .getExaminationsByOffering(offeringId);
    }

    @PostMapping
    public ResponseEntity<ExaminationResponse> createExamination(
            @Valid @RequestBody ExaminationRequest request) {

        ExaminationResponse response =
                examinationService.createExamination(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}