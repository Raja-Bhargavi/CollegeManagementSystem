
package college_management_backend.dto;

import college_management_backend.entity.Notice;

import java.time.LocalDateTime;


public class NoticeResponse {

    private Long noticeId;
    private String title;
    private String content;
    private Long createdBy;
    private LocalDateTime publishedAt;
    private LocalDateTime expiryDate;
    private String visibility;
    private String status;
    private String category;
    private Long departmentId;
    private String programLevel;
    private String departmentScope;
    private java.util.Set<Long> targetDepartmentIds;

    public NoticeResponse(Notice notice) {
        this.noticeId = notice.getNoticeId();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.createdBy = notice.getCreatedBy();
        this.publishedAt = notice.getPublishedAt();
        this.expiryDate = notice.getExpiryDate();
        this.visibility = notice.getVisibility();
        this.status = notice.getStatus();
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

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public String getVisibility() {
        return visibility;
    }

    public String getStatus() {
        return status;
    }

    public String getCategory() {
        return category;
    }

    public Long getDepartmentId() {
        return departmentId;
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
