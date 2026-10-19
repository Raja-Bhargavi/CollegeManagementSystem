
package college_management_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "notices")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "visibility", nullable = false, length = 30)
    private String visibility;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "category", nullable = false, length = 30)
    private String category = "GENERAL";

    // NULL means the notice is not restricted to one department.
    @Column(name = "department_id")
    private Long departmentId;

    // ALL applies to B.Tech and M.Tech.
    @Column(name = "program_level", nullable = false, length = 20)
    private String programLevel = "ALL";

    @Column(name = "department_scope", nullable = false, length = 20)
    private String departmentScope = "ALL";

    @ElementCollection
    @CollectionTable(
        name = "notice_target_departments",
        joinColumns = @JoinColumn(name = "notice_id")
    )
    @Column(name = "department_id", nullable = false)
    private Set<Long> targetDepartmentIds = new HashSet<>();

    public String getDepartmentScope() {
        return departmentScope;
    }

    public void setDepartmentScope(String departmentScope) {
        this.departmentScope = departmentScope;
    }

    public Set<Long> getTargetDepartmentIds() {
        return targetDepartmentIds;
    }

    public void setTargetDepartmentIds(Set<Long> targetDepartmentIds) {
        this.targetDepartmentIds = targetDepartmentIds == null
                ? new HashSet<>()
                : new HashSet<>(targetDepartmentIds);
    }

    public Notice() {
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

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
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

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public void setProgramLevel(String programLevel) {
        this.programLevel = programLevel;
    }
}
