
package college_management_backend.controller;

import college_management_backend.dto.ActivateStudentRequest;
import college_management_backend.dto.ActivateStudentResponse;
import college_management_backend.service.StudentActivationService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/student-activation")
public class StudentActivationController {

    private final StudentActivationService activationService;

    public StudentActivationController(
            StudentActivationService activationService) {
        this.activationService = activationService;
    }

    @PostMapping
    public ResponseEntity<ActivateStudentResponse> activate(
            @Valid @RequestBody ActivateStudentRequest request) {
        return ResponseEntity.ok(activationService.activate(request));
    }
}
