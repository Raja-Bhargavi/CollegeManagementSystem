package college_management_backend.controller;
import java.util.List;

import college_management_backend.dto.StudentRequest;
import jakarta.validation.Valid;

import college_management_backend.dto.StudentResponse;
import college_management_backend.service.StudentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/{id}")
    public StudentResponse getStudentById(@PathVariable Long id) {

        return studentService.getStudentById(id);
    }

    @GetMapping
    public List<StudentResponse> getAllStudents() {

    return studentService.getAllStudents();
    }

    @PostMapping
    public StudentResponse createStudent(
            @Valid @RequestBody StudentRequest request) {

        return studentService.createStudent(request);
    }

     @PutMapping("/{id}")
    public StudentResponse updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        return studentService.updateStudent(id, request);
    }

    @DeleteMapping("/{id}")
    public StudentResponse deactivateStudent(@PathVariable Long id) {

        return studentService.deactivateStudent(id);
    }
}