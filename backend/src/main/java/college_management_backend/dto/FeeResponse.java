package college_management_backend.dto;

import college_management_backend.entity.Fee;

import java.time.LocalDate;

public class FeeResponse {

    private Long feeId;
    private Long studentId;
    private Long semesterId;
    private String feeType;
    private Double amount;
    private LocalDate dueDate;
    private String status;

    public FeeResponse(Fee fee) {
        this.feeId = fee.getFeeId();
        this.studentId = fee.getStudentId();
        this.semesterId = fee.getSemesterId();
        this.feeType = fee.getFeeType();
        this.amount = fee.getAmount();
        this.dueDate = fee.getDueDate();
        this.status = fee.getStatus();
    }

    public Long getFeeId() {
        return feeId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getSemesterId() {
        return semesterId;
    }

    public String getFeeType() {
        return feeType;
    }

    public Double getAmount() {
        return amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public String getStatus() {
        return status;
    }
}