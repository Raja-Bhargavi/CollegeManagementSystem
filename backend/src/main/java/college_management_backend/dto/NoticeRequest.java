
package college_management_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

import java.time.LocalDateTime;

public class NoticeRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Created by is required")
    private Long createdBy;

    private LocalDateTime publishedAt;

    private LocalDateTime expiryDate;

    private String departmentScope = "ALL";
    private List<Long> targetDepartmentIds = List.of();

    @NotBlank(message = "Visibility is required")
    @Size(max = 30, message = "Visibility cannot exceed 30 characters")
    private String visibility;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status cannot exceed 20 characters")
    private String status;

    @NotBlank(message = "Category is required")
    @Size(max = 30, message = "Category cannot exceed 30 characters")
    private String category = "GENERAL";

    private Long departmentId;

    @NotBlank(message = "Programme level is required")
    @Size(max = 20, message = "Programme level cannot exceed 20 characters")
    private String programLevel = "ALL";

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

    public String getDepartmentScope() {
    return departmentScope;
    }

    public void setDepartmentScope(String departmentScope) {
        this.departmentScope = departmentScope;
    }

    public List<Long> getTargetDepartmentIds() {
        return targetDepartmentIds;
    }

    public void setTargetDepartmentIds(List<Long> targetDepartmentIds) {
        this.targetDepartmentIds = targetDepartmentIds;
    }
}
