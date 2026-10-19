
package college_management_backend.dto.publicdto;

import college_management_backend.entity.Notice;

import java.time.LocalDateTime;

public class PublicNoticeResponse {

    private Long noticeId;
    private String title;
    private String content;
    private LocalDateTime publishedAt;
    private LocalDateTime expiryDate;
    private String category;
    private Long departmentId;
    private String programLevel;
    private String departmentScope;
    private java.util.Set<Long> targetDepartmentIds;

    public PublicNoticeResponse() {
    }

    public PublicNoticeResponse(Notice notice) {
        this.noticeId = notice.getNoticeId();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.publishedAt = notice.getPublishedAt();
        this.expiryDate = notice.getExpiryDate();
        this.category = notice.getCategory();
        this.departmentId = notice.getDepartmentId();
        this.programLevel = notice.getProgramLevel();
        this.departmentScope = notice.getDepartmentScope();
        this.targetDepartmentIds = new java.util.HashSet<>(
                notice.getTargetDepartmentIds()
        );
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getProgramLevel() {
    return programLevel;
    }

    public String getDepartmentScope() {
        return departmentScope;
    }

    public java.util.Set<Long> getTargetDepartmentIds() {
        return targetDepartmentIds;
    }
}

