-- reporting

USE college_management;

-- ============================================
-- 05_views.sql
-- Database views for frequently used reports
-- ============================================


-- ============================================
-- 1. STUDENT ACADEMIC VIEW
-- ============================================

DROP VIEW IF EXISTS student_academic_view;

CREATE VIEW student_academic_view AS
SELECT
    s.student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    p.program_code,
    p.program_name,
    d.department_code,
    d.department_name,
    s.current_semester,
    s.student_status
FROM students s
JOIN programs p
    ON s.program_id = p.program_id
JOIN departments d
    ON p.department_id = d.department_id;


-- ============================================
-- 2. COURSE REGISTRATION VIEW
-- ============================================

DROP VIEW IF EXISTS course_registration_view;

CREATE VIEW course_registration_view AS
SELECT
    cr.registration_id,
    s.student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,

    c.course_code,
    c.course_name,
    c.credits,

    sem.academic_year,
    sem.semester_number,

    sec.section_name,

    CONCAT(f.first_name, ' ', f.last_name) AS faculty_name,

    cr.registration_date,
    cr.status

FROM course_registrations cr

JOIN students s
    ON cr.student_id = s.student_id

JOIN course_offerings co
    ON cr.offering_id = co.offering_id

JOIN courses c
    ON co.course_id = c.course_id

JOIN sections sec
    ON co.section_id = sec.section_id

JOIN semesters sem
    ON sec.semester_id = sem.semester_id

JOIN faculty f
    ON co.faculty_id = f.faculty_id;


-- ============================================
-- 3. ATTENDANCE SUMMARY VIEW
-- ============================================

DROP VIEW IF EXISTS attendance_summary_view;

CREATE VIEW attendance_summary_view AS
SELECT
    cr.student_id,
    s.roll_number,

    c.course_id,
    c.course_code,
    c.course_name,

    COUNT(a.attendance_id) AS total_classes,

    SUM(
        CASE
            WHEN a.status = 'PRESENT' THEN 1
            ELSE 0
        END
    ) AS classes_present,

    ROUND(
        (
            SUM(
                CASE
                    WHEN a.status = 'PRESENT' THEN 1
                    ELSE 0
                END
            ) * 100.0
        )
        / NULLIF(COUNT(a.attendance_id), 0),
        2
    ) AS attendance_percentage

FROM course_registrations cr

JOIN students s
    ON cr.student_id = s.student_id

JOIN course_offerings co
    ON cr.offering_id = co.offering_id

JOIN courses c
    ON co.course_id = c.course_id

LEFT JOIN attendance a
    ON cr.registration_id = a.registration_id

GROUP BY
    cr.student_id,
    s.roll_number,
    c.course_id,
    c.course_code,
    c.course_name;


-- ============================================
-- 4. DEPARTMENT STUDENT SUMMARY
-- ============================================

DROP VIEW IF EXISTS department_student_summary;

CREATE VIEW department_student_summary AS
SELECT
    d.department_id,
    d.department_code,
    d.department_name,

    COUNT(s.student_id) AS total_students

FROM departments d

LEFT JOIN programs p
    ON p.department_id = d.department_id

LEFT JOIN students s
    ON s.program_id = p.program_id

GROUP BY
    d.department_id,
    d.department_code,
    d.department_name;


-- ============================================
-- 5. FACULTY COURSE WORKLOAD
-- ============================================

DROP VIEW IF EXISTS faculty_course_workload;

CREATE VIEW faculty_course_workload AS
SELECT
    f.faculty_id,
    f.employee_number,

    CONCAT(
        f.first_name,
        ' ',
        f.last_name
    ) AS faculty_name,

    COUNT(co.offering_id) AS courses_assigned

FROM faculty f

LEFT JOIN course_offerings co
    ON f.faculty_id = co.faculty_id

GROUP BY
    f.faculty_id,
    f.employee_number,
    f.first_name,
    f.last_name;