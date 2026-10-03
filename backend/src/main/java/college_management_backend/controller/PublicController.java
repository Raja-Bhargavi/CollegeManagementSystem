package college_management_backend.controller;

import college_management_backend.dto.publicdto.PublicCourseResponse;
import college_management_backend.dto.publicdto.PublicDepartmentResponse;
import college_management_backend.dto.publicdto.PublicEventResponse;
import college_management_backend.dto.publicdto.PublicFacultyResponse;
import college_management_backend.dto.publicdto.PublicNoticeResponse;
import college_management_backend.service.PublicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    @GetMapping("/departments")
    public ResponseEntity<List<PublicDepartmentResponse>>
    getPublicDepartments() {

        return ResponseEntity.ok(
                publicService.getPublicDepartments()
        );
    }

    @GetMapping("/courses")
    public ResponseEntity<List<PublicCourseResponse>>
    getPublicCourses() {

        return ResponseEntity.ok(
                publicService.getPublicCourses()
        );
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<PublicCourseResponse>
    getPublicCourseById(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                publicService.getPublicCourseById(courseId)
        );
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<PublicFacultyResponse>>
    getPublicFaculty() {

        return ResponseEntity.ok(
                publicService.getPublicFaculty()
        );
    }

    @GetMapping("/notices")
    public ResponseEntity<List<PublicNoticeResponse>>
    getPublicNotices() {

        return ResponseEntity.ok(
                publicService.getPublicNotices()
        );
    }

    @GetMapping("/events")
    public ResponseEntity<List<PublicEventResponse>>
    getPublicEvents() {

        return ResponseEntity.ok(
                publicService.getPublicEvents()
        );
    }
}