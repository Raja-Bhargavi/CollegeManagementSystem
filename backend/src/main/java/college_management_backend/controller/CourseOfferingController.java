package college_management_backend.controller;

import college_management_backend.dto.CourseOfferingRequest;
import college_management_backend.dto.CourseOfferingResponse;
import college_management_backend.service.CourseOfferingService;
import college_management_backend.service.FacultyService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-offerings")
@SecurityRequirement(name = "bearerAuth")
public class CourseOfferingController {

    private final CourseOfferingService courseOfferingService;
    private final FacultyService facultyService;

    public CourseOfferingController(
            CourseOfferingService courseOfferingService,
            FacultyService facultyService) {

        this.courseOfferingService =
                courseOfferingService;

        this.facultyService =
                facultyService;
    }

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN','STAFF','FACULTY')"
    )
    public List<CourseOfferingResponse> getAllOfferings() {

        return courseOfferingService
                .getAllOfferings();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('FACULTY')")
    public List<CourseOfferingResponse> getMyCourses(
            Authentication authentication) {

        Long facultyId =
                facultyService
                        .getFacultyByUsername(
                                authentication.getName()
                        )
                        .getFacultyId();

        return courseOfferingService
                .getOfferingsByFaculty(facultyId);
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('ADMIN','STAFF','FACULTY')"
    )
    public CourseOfferingResponse getOfferingById(
            @PathVariable Long id) {

        return courseOfferingService
                .getOfferingById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public CourseOfferingResponse createOffering(
            @RequestBody CourseOfferingRequest request) {

        return courseOfferingService
                .createOffering(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public CourseOfferingResponse updateOffering(
            @PathVariable Long id,
            @RequestBody CourseOfferingRequest request) {

        return courseOfferingService
                .updateOffering(
                        id,
                        request
                );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteOffering(
            @PathVariable Long id) {

        courseOfferingService
                .deleteOffering(id);
    }
}