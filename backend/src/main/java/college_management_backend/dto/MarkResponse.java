package college_management_backend.dto;

public class MarkResponse {

    private Long markId;
    private Long examId;
    private Long studentId;
    private Double marksObtained;
    private String remarks;

    public MarkResponse(
            Long markId,
            Long examId,
            Long studentId,
            Double marksObtained,
            String remarks) {

        this.markId = markId;
        this.examId = examId;
        this.studentId = studentId;
        this.marksObtained = marksObtained;
        this.remarks = remarks;
    }

    public Long getMarkId() {
        return markId;
    }

    public Long getExamId() {
        return examId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Double getMarksObtained() {
        return marksObtained;
    }

    public String getRemarks() {
        return remarks;
    }
}