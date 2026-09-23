package college_management_backend.service;

import college_management_backend.dto.NoticeRequest;
import college_management_backend.dto.NoticeResponse;
import college_management_backend.entity.Notice;
import college_management_backend.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<NoticeResponse> getAllNotices() {
        return noticeRepository.findAll()
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public NoticeResponse getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        return new NoticeResponse(notice);
    }

    public List<NoticeResponse> getNoticesByCreatedBy(Long createdBy) {
        return noticeRepository.findByCreatedBy(createdBy)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getNoticesByVisibility(String visibility) {
        return noticeRepository.findByVisibility(visibility)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getNoticesByStatus(String status) {
        return noticeRepository.findByStatus(status)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public List<NoticeResponse> getNoticesByVisibilityAndStatus(
            String visibility,
            String status) {

        return noticeRepository
                .findByVisibilityAndStatus(visibility, status)
                .stream()
                .map(NoticeResponse::new)
                .toList();
    }

    public NoticeResponse createNotice(NoticeRequest request) {

        Notice notice = new Notice();

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setCreatedBy(request.getCreatedBy());
        notice.setPublishedAt(request.getPublishedAt());
        notice.setExpiryDate(request.getExpiryDate());
        notice.setVisibility(request.getVisibility());
        notice.setStatus(request.getStatus());

        if ("PUBLISHED".equalsIgnoreCase(request.getStatus())
                && request.getPublishedAt() == null) {
            notice.setPublishedAt(LocalDateTime.now());
        }

        Notice savedNotice = noticeRepository.save(notice);

        return new NoticeResponse(savedNotice);
    }

    public NoticeResponse updateNotice(Long noticeId, NoticeRequest request) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setCreatedBy(request.getCreatedBy());
        notice.setPublishedAt(request.getPublishedAt());
        notice.setExpiryDate(request.getExpiryDate());
        notice.setVisibility(request.getVisibility());
        notice.setStatus(request.getStatus());

        if ("PUBLISHED".equalsIgnoreCase(request.getStatus())
                && request.getPublishedAt() == null
                && notice.getPublishedAt() == null) {
            notice.setPublishedAt(LocalDateTime.now());
        }

        Notice updatedNotice = noticeRepository.save(notice);

        return new NoticeResponse(updatedNotice);
    }

    public void deleteNotice(Long noticeId) {

        if (!noticeRepository.existsById(noticeId)) {
            throw new RuntimeException("Notice not found");
        }

        noticeRepository.deleteById(noticeId);
    }
}
