package college_management_backend.service;

import college_management_backend.dto.VisitorInquiryRequest;
import college_management_backend.entity.VisitorInquiry;
import college_management_backend.repository.VisitorInquiryRepository;

import org.springframework.stereotype.Service;

@Service
public class VisitorInquiryService {

    private final VisitorInquiryRepository visitorInquiryRepository;

    public VisitorInquiryService(
            VisitorInquiryRepository visitorInquiryRepository) {

        this.visitorInquiryRepository = visitorInquiryRepository;
    }

    public VisitorInquiry createInquiry(
            VisitorInquiryRequest request) {

        VisitorInquiry inquiry = new VisitorInquiry();

        inquiry.setName(request.getName().trim());
        inquiry.setEmail(request.getEmail().trim());
        inquiry.setPhone(
                request.getPhone() != null
                        ? request.getPhone().trim()
                        : null
        );
        inquiry.setSubject(request.getSubject().trim());
        inquiry.setMessage(request.getMessage().trim());
        inquiry.setStatus("NEW");

        return visitorInquiryRepository.save(inquiry);
    }
}