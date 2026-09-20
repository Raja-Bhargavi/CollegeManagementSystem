package college_management_backend.controller;

import college_management_backend.dto.MarkRequest;
import college_management_backend.dto.MarkResponse;
import college_management_backend.service.MarkService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    private final MarkService markService;

    public MarkController(MarkService markService) {
        this.markService = markService;
    }

    @GetMapping
    public List<MarkResponse> getAllMarks() {

        return markService.getAllMarks();
    }

    @GetMapping("/{id}")
    public MarkResponse getMarkById(
            @PathVariable Long id) {

        return markService.getMarkById(id);
    }

    @GetMapping("/exam/{examId}")
    public List<MarkResponse> getMarksByExam(
            @PathVariable Long examId) {

        return markService.getMarksByExam(examId);
    }

    @GetMapping("/student/{studentId}")
    public List<MarkResponse> getMarksByStudent(
            @PathVariable Long studentId) {

        return markService.getMarksByStudent(studentId);
    }

    @PostMapping
    public ResponseEntity<MarkResponse> createMark(
            @Valid @RequestBody MarkRequest request) {

        MarkResponse response =
                markService.createMark(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}