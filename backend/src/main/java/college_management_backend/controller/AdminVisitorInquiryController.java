
package college_management_backend.controller;

import college_management_backend.entity.VisitorInquiry;
import college_management_backend.service.VisitorInquiryService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({
        "/api/admin/visitor-inquiries",
        "/api/visitor",
        "/api/visitors"
})
@PreAuthorize("hasRole('ADMIN')")
public class AdminVisitorInquiryController {

    private final VisitorInquiryService visitorInquiryService;

    public AdminVisitorInquiryController(
            VisitorInquiryService visitorInquiryService) {
        this.visitorInquiryService = visitorInquiryService;
    }

    @GetMapping
    public ResponseEntity<List<VisitorInquiry>> getAllInquiries() {
        return ResponseEntity.ok(
                visitorInquiryService.getAllInquiries()
        );
    }
}
