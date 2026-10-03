package college_management_backend.dto.publicdto;

import college_management_backend.entity.Notice;

import java.time.LocalDateTime;

public class PublicNoticeResponse {

    private Long noticeId;
    private String title;
    private String content;
    private LocalDateTime publishedAt;
    private LocalDateTime expiryDate;

    public PublicNoticeResponse() {
    }

    public PublicNoticeResponse(Notice notice) {
        this.noticeId = notice.getNoticeId();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.publishedAt = notice.getPublishedAt();
        this.expiryDate = notice.getExpiryDate();
    }

    public Long getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(Long noticeId) {
        this.noticeId = noticeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }
}