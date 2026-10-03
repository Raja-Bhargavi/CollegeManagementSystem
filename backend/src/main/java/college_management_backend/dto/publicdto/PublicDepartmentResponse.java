package college_management_backend.dto.publicdto;

import college_management_backend.entity.Department;

public class PublicDepartmentResponse {

    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private String description;

    public PublicDepartmentResponse() {
    }

    public PublicDepartmentResponse(Department department) {
        this.departmentId = department.getDepartmentId();
        this.departmentCode = department.getDepartmentCode();
        this.departmentName = department.getDepartmentName();
        this.description = department.getDescription();
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}