package college_management_backend.dto;

import college_management_backend.entity.Approval;

import java.time.LocalDateTime;

public class ApprovalResponse {

    private Long approvalId;
    private Long applicationId;
    private Long approverUserId;
    private String action;
    private String comments;
    private LocalDateTime actionDate;

    public ApprovalResponse(Approval approval) {
        this.approvalId = approval.getApprovalId();
        this.applicationId = approval.getApplicationId();
        this.approverUserId = approval.getApproverUserId();
        this.action = approval.getAction();
        this.comments = approval.getComments();
        this.actionDate = approval.getActionDate();
    }

    public Long getApprovalId() {
        return approvalId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public Long getApproverUserId() {
        return approverUserId;
    }

    public String getAction() {
        return action;
    }

    public String getComments() {
        return comments;
    }

    public LocalDateTime getActionDate() {
        return actionDate;
    }
}