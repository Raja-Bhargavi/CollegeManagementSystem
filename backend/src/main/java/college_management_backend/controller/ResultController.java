package college_management_backend.controller;

import college_management_backend.dto.FacultyResultUpdateRequest;
import college_management_backend.dto.ResultRequest;
import college_management_backend.dto.ResultResponse;
import college_management_backend.service.FacultyService;
import college_management_backend.service.ResultService;
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
@RequestMapping("/api/results")
@SecurityRequirement(name = "bearerAuth")
public class ResultController {

    private final ResultService resultService;
    private final StudentService studentService;
    private final FacultyService facultyService;

    public ResultController(
            ResultService resultService,
            StudentService studentService,
            FacultyService facultyService) {

        this.resultService = resultService;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }

    // =========================================================
    // VIEW RESULTS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')")
    public List<ResultResponse> getAllResults() {

        return resultService.getAllResults();
    }

    // =========================================================
    // STUDENT
    // =========================================================

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public List<ResultResponse> getMyResults(
            Authentication authentication) {

        Long studentId =
                studentService
                        .getStudentByUsername(
                                authentication.getName()
                        )
                        .getStudentId();

        return resultService.getResultsByStudent(studentId);
    }

    // =========================================================
    // FACULTY - OWN RESULTS
    // =========================================================

    @GetMapping("/faculty/me")
    @PreAuthorize("hasRole('FACULTY')")
    public List<ResultResponse> getMyFacultyResults(
            Authentication authentication) {

        Long facultyId =
                facultyService
                        .getFacultyByUsername(
                                authentication.getName()
                        )
                        .getFacultyId();

        return resultService.getResultsByFaculty(facultyId);
    }

    // =========================================================
    // FACULTY - UPDATE OWN RESULT
    // =========================================================

    @PutMapping("/faculty/{resultId}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ResultResponse> updateResultByFaculty(
            @PathVariable Long resultId,
            @Valid @RequestBody FacultyResultUpdateRequest request,
            Authentication authentication) {

        Long facultyId =
                facultyService
                        .getFacultyByUsername(
                                authentication.getName()
                        )
                        .getFacultyId();

        return ResponseEntity.ok(
                resultService.updateResultByFaculty(
                        resultId,
                        request,
                        facultyId
                )
        );
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{resultId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')")
    public ResultResponse getResultById(
            @PathVariable Long resultId) {

        return resultService.getResultById(resultId);
    }

    // =========================================================
    // GET BY STUDENT
    // =========================================================

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')")
    public List<ResultResponse> getResultsByStudent(
            @PathVariable Long studentId) {

        return resultService.getResultsByStudent(studentId);
    }

    // =========================================================
    // GET BY SEMESTER
    // =========================================================

    @GetMapping("/semester/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY', 'MANAGEMENT')")
    public List<ResultResponse> getResultsBySemester(
            @PathVariable Long semesterId) {

        return resultService.getResultsBySemester(semesterId);
    }

    // =========================================================
    // PUBLISH
    // ADMIN ONLY
    // =========================================================

    @PostMapping("/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> publishResult(
            @Valid @RequestBody ResultRequest request) {

        resultService.publishResult(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        "Student result published successfully"
                );
    }

    // =========================================================
    // UPDATE
    // ADMIN ONLY
    // =========================================================

    @PutMapping("/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponse> updateResult(
            @PathVariable Long resultId,
            @Valid @RequestBody ResultRequest request) {

        return ResponseEntity.ok(
                resultService.updateResult(
                        resultId,
                        request
                )
        );
    }

    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    @DeleteMapping("/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long resultId) {

        resultService.deleteResult(resultId);

        return ResponseEntity.noContent().build();
    }
}