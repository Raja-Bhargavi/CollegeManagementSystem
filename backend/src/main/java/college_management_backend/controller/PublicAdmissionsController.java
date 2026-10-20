
package college_management_backend.controller;

import college_management_backend.dto.AdmissionSubmissionRequest;
import college_management_backend.dto.AdmissionSubmissionResponse;
import college_management_backend.dto.ProgramOptionResponse;
import college_management_backend.repository.ProgramRepository;
import college_management_backend.service.AdmissionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/admissions")
public class PublicAdmissionsController {

    private final ProgramRepository programRepository;
    private final AdmissionService admissionService;

    public PublicAdmissionsController(
            ProgramRepository programRepository,
            AdmissionService admissionService) {
        this.programRepository = programRepository;
        this.admissionService = admissionService;
    }

    @GetMapping("/programs")
    public List<ProgramOptionResponse> getPrograms() {
        return programRepository.findProgramOptions()
                .stream()
                .map(p -> new ProgramOptionResponse(
                        p.getProgramId(),
                        p.getProgramCode(),
                        p.getProgramName(),
                        p.getDegreeType(),
                        p.getDurationYears(),
                        p.getDepartmentName()
                ))
                .toList();
    }

    @PostMapping
    public ResponseEntity<AdmissionSubmissionResponse> submit(
            @Valid @RequestBody AdmissionSubmissionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(admissionService.submit(request));
    }
}
