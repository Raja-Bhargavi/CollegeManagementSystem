package college_management_backend.dto;

public class MarkResponse {

    private Long markId;
    private Long examId;
    private String examType;

    private Long studentId;
    private String studentName;

    private Double marksObtained;
    private String remarks;

    public MarkResponse() {
    }

    public MarkResponse(
            Long markId,
            Long examId,
            String examType,
            Long studentId,
            String studentName,
            Double marksObtained,
            String remarks
    ) {
        this.markId = markId;
        this.examId = examId;
        this.examType = examType;
        this.studentId = studentId;
        this.studentName = studentName;
        this.marksObtained = marksObtained;
        this.remarks = remarks;
    }

    public Long getMarkId() {
        return markId;
    }

    public void setMarkId(Long markId) {
        this.markId = markId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}