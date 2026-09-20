package college_management_backend.dto;

import college_management_backend.entity.Result;

import java.time.LocalDateTime;

public class ResultResponse {

    private Long resultId;
    private Long studentId;
    private Long semesterId;
    private Double sgpa;
    private Double cgpa;
    private String resultStatus;
    private LocalDateTime publishedAt;

    public ResultResponse(Result result) {
        this.resultId = result.getResultId();
        this.studentId = result.getStudentId();
        this.semesterId = result.getSemesterId();
        this.sgpa = result.getSgpa();
        this.cgpa = result.getCgpa();
        this.resultStatus = result.getResultStatus();
        this.publishedAt = result.getPublishedAt();
    }

    public Long getResultId() {
        return resultId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Long getSemesterId() {
        return semesterId;
    }

    public Double getSgpa() {
        return sgpa;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }
}