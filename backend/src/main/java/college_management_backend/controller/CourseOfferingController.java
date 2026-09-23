package college_management_backend.controller;

import college_management_backend.dto.CourseOfferingRequest;
import college_management_backend.dto.CourseOfferingResponse;
import college_management_backend.service.CourseOfferingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public List<CourseOfferingResponse> getAllOfferings() {

        return courseOfferingService.getAllOfferings();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'FACULTY')")
    public CourseOfferingResponse getOfferingById(
            @PathVariable Long id) {

        return courseOfferingService.getOfferingById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseOfferingResponse> createOffering(
            @Valid @RequestBody CourseOfferingRequest request) {

        CourseOfferingResponse response =
                courseOfferingService.createOffering(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CourseOfferingResponse updateOffering(
            @PathVariable Long id,
            @Valid @RequestBody CourseOfferingRequest request) {

        return courseOfferingService.updateOffering(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffering(
            @PathVariable Long id) {

        courseOfferingService.deleteOffering(id);

        return ResponseEntity.noContent().build();
    }
}