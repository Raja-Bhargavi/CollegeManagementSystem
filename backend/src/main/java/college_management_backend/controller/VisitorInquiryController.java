package college_management_backend.controller;

import college_management_backend.dto.VisitorInquiryRequest;
import college_management_backend.entity.VisitorInquiry;
import college_management_backend.service.VisitorInquiryService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/inquiries")
public class VisitorInquiryController {

    private final VisitorInquiryService visitorInquiryService;

    public VisitorInquiryController(
            VisitorInquiryService visitorInquiryService) {

        this.visitorInquiryService = visitorInquiryService;
    }

    @PostMapping
    public ResponseEntity<?> createInquiry(
            @Valid @RequestBody VisitorInquiryRequest request) {

        VisitorInquiry inquiry =
                visitorInquiryService.createInquiry(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        Map.of(
                                "status", "success",
                                "message",
                                "Your inquiry has been submitted successfully",
                                "inquiryId",
                                inquiry.getInquiryId()
                        )
                );
    }
}