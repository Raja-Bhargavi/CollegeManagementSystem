package college_management_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "course_code", nullable = false, unique = true, length = 30)
    private String courseCode;

    @Column(name = "course_name", nullable = false, length = 150)
    private String courseName;

    @Column(name = "credits")
    private Integer credits;

    @Column(name = "description", length = 1000)
    private String description;

    /*
     * Department to which this course belongs.
     * Kept as Long instead of @ManyToOne so that the existing
     * department module remains independent.
     */
    @Column(name = "department_id")
    private Long departmentId;

    /*
     * Academic level of the course.
     * Expected values:
     * BTECH
     * MTECH
     */
    @Column(name = "program_level", length = 20)
    private String programLevel;

    public Course() {
    }

    public Course(
            Long courseId,
            String courseCode,
            String courseName,
            Integer credits,
            String description,
            Long departmentId,
            String programLevel
    ) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.credits = credits;
        this.description = description;
        this.departmentId = departmentId;
        this.programLevel = programLevel;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}