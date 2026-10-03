package college_management_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "faculty")
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faculty_id")
    private Long facultyId;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "employee_number", nullable = false, unique = true, length = 30)
    private String employeeNumber;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    /*
     * Kept in the entity because it is part of the existing
     * faculty data model.
     *
     * IMPORTANT:
     * This field will NOT be exposed through the public faculty DTO.
     */
    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "designation", nullable = false, length = 100)
    private String designation;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "faculty_status", length = 30)
    private String facultyStatus;

    /*
     * Public academic profile.
     */
    @Column(name = "profile", length = 2000)
    private String profile;

    /*
     * Research areas displayed on the public faculty profile.
     */
    @Column(name = "research_areas", length = 2000)
    private String researchAreas;

    /*
     * Academic/research projects displayed on the public faculty profile.
     */
    @Column(name = "projects", length = 3000)
    private String projects;

    public Faculty() {
    }

    public Faculty(
            Long facultyId,
            Long userId,
            String employeeNumber,
            String firstName,
            String lastName,
            String phone,
            String designation,
            Long departmentId,
            LocalDate joiningDate,
            String facultyStatus,
            String profile,
            String researchAreas,
            String projects
    ) {
        this.facultyId = facultyId;
        this.userId = userId;
        this.employeeNumber = employeeNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.designation = designation;
        this.departmentId = departmentId;
        this.joiningDate = joiningDate;
        this.facultyStatus = facultyStatus;
        this.profile = profile;
        this.researchAreas = researchAreas;
        this.projects = projects;
    }

    public Long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Long facultyId) {
        this.facultyId = facultyId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public String getFacultyStatus() {
        return facultyStatus;
    }

    public void setFacultyStatus(String facultyStatus) {
        this.facultyStatus = facultyStatus;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getResearchAreas() {
        return researchAreas;
    }

    public void setResearchAreas(String researchAreas) {
        this.researchAreas = researchAreas;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }
}