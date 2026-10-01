package college_management_backend.controller;

import college_management_backend.dto.MarkRequest;
import college_management_backend.dto.MarkResponse;
import college_management_backend.service.MarkService;
import college_management_backend.service.StudentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@SecurityRequirement(name = "bearerAuth")
public class MarkController {

    private final MarkService markService;
    private final StudentService studentService;

    public MarkController(
            MarkService markService,
            StudentService studentService) {

        this.markService = markService;
        this.studentService = studentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<MarkResponse> getAllMarks() {
        return markService.getAllMarks();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<MarkResponse> getMyMarks(
            Authentication authentication) {

        Long studentId =
                studentService
                        .getStudentByUsername(authentication.getName())
                        .getStudentId();

        return markService.getMarksByStudent(studentId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public MarkResponse getMarkById(
            @PathVariable Long id) {

        return markService.getMarkById(id);
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<MarkResponse> getMarksByExam(
            @PathVariable Long examId) {

        return markService.getMarksByExam(examId);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<MarkResponse> getMarksByStudent(
            @PathVariable Long studentId) {

        return markService.getMarksByStudent(studentId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public ResponseEntity<MarkResponse> createMark(
            @Valid @RequestBody MarkRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(markService.createMark(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public MarkResponse updateMark(
            @PathVariable Long id,
            @Valid @RequestBody MarkRequest request) {

        return markService.updateMark(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMark(
            @PathVariable Long id) {

        markService.deleteMark(id);

        return ResponseEntity.noContent().build();
    }
}