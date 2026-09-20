package college_management_backend.controller;

import college_management_backend.dto.CourseOfferingRequest;
import college_management_backend.dto.CourseOfferingResponse;
import college_management_backend.service.CourseOfferingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-offerings")
public class CourseOfferingController {

    private final CourseOfferingService courseOfferingService;

    public CourseOfferingController(
            CourseOfferingService courseOfferingService) {

        this.courseOfferingService = courseOfferingService;
    }

    @GetMapping
    public List<CourseOfferingResponse> getAllOfferings() {

        return courseOfferingService.getAllOfferings();
    }

    @GetMapping("/{id}")
    public CourseOfferingResponse getOfferingById(
            @PathVariable Long id) {

        return courseOfferingService.getOfferingById(id);
    }

    @PostMapping
    public ResponseEntity<CourseOfferingResponse> createOffering(
            @Valid @RequestBody CourseOfferingRequest request) {

        CourseOfferingResponse response =
                courseOfferingService.createOffering(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}