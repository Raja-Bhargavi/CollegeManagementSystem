package college_management_backend.dto;

import java.time.LocalDate;

public class ExaminationResponse {

    private Long examId;
    private Long offeringId;
    private String examType;
    private LocalDate examDate;
    private Double maximumMarks;
    private String status;

    public ExaminationResponse(
            Long examId,
            Long offeringId,
            String examType,
            LocalDate examDate,
            Double maximumMarks,
            String status) {

        this.examId = examId;
        this.offeringId = offeringId;
        this.examType = examType;
        this.examDate = examDate;
        this.maximumMarks = maximumMarks;
        this.status = status;
    }

    public Long getExamId() {
        return examId;
    }

    public Long getOfferingId() {
        return offeringId;
    }

    public String getExamType() {
        return examType;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public Double getMaximumMarks() {
        return maximumMarks;
    }

    public String getStatus() {
        return status;
    }
}