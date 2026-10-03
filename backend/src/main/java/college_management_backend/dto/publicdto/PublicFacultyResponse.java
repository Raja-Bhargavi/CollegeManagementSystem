package college_management_backend.dto.publicdto;

import college_management_backend.entity.Faculty;

public class PublicFacultyResponse {

    private Long facultyId;
    private String firstName;
    private String lastName;
    private String designation;
    private Long departmentId;

    public PublicFacultyResponse() {
    }

    public PublicFacultyResponse(Faculty faculty) {
        this.facultyId = faculty.getFacultyId();
        this.firstName = faculty.getFirstName();
        this.lastName = faculty.getLastName();
        this.designation = faculty.getDesignation();
        this.departmentId = faculty.getDepartmentId();
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }
}