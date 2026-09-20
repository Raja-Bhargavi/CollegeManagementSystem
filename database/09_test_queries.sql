-- testing

USE college_management;

-- ============================================
-- 09_test_queries.sql
-- ADBMS Testing Queries
-- ============================================


-- ============================================
-- 1. BASIC TABLE CHECK
-- ============================================

SELECT COUNT(*) AS total_users
FROM users;

SELECT COUNT(*) AS total_students
FROM students;

SELECT COUNT(*) AS total_courses
FROM courses;


-- ============================================
-- 2. STUDENT ACADEMIC VIEW
-- ============================================

SELECT *
FROM student_academic_view;


-- ============================================
-- 3. COURSE REGISTRATION VIEW
-- ============================================

SELECT *
FROM course_registration_view;


-- ============================================
-- 4. ATTENDANCE SUMMARY
-- ============================================

SELECT *
FROM attendance_summary_view;


-- ============================================
-- 5. DEPARTMENT STUDENT SUMMARY
-- ============================================

SELECT *
FROM department_student_summary;


-- ============================================
-- 6. FACULTY WORKLOAD
-- ============================================

SELECT *
FROM faculty_course_workload;


-- ============================================
-- 7. COMPLEX JOIN
-- ============================================

SELECT
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    c.course_code,
    c.course_name,
    CONCAT(f.first_name, ' ', f.last_name) AS faculty_name,
    sem.academic_year,
    sem.semester_number

FROM students s

JOIN course_registrations cr
    ON s.student_id = cr.student_id

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
-- 8. GROUP BY + HAVING
-- ============================================

SELECT
    d.department_name,
    COUNT(s.student_id) AS total_students

FROM departments d

JOIN programs p
    ON d.department_id = p.department_id

JOIN students s
    ON p.program_id = s.program_id

GROUP BY d.department_id, d.department_name

HAVING COUNT(s.student_id) > 0;


-- ============================================
-- 9. SUBQUERY
-- Find students whose semester is above
-- the average current semester
-- ============================================

SELECT
    student_id,
    roll_number,
    current_semester

FROM students

WHERE current_semester >
(
    SELECT AVG(current_semester)
    FROM students
);


-- ============================================
-- 10. TRANSACTION TEST
-- ============================================

START TRANSACTION;

INSERT INTO notifications
(
    user_id,
    title,
    message,
    created_at,
    read_status
)
VALUES
(
    2,
    'Transaction Test',
    'This notification will be rolled back',
    NOW(),
    FALSE
);

SELECT *
FROM notifications
WHERE title = 'Transaction Test';

ROLLBACK;

SELECT *
FROM notifications
WHERE title = 'Transaction Test';


-- ============================================
-- 11. EXPLAIN QUERY
-- ============================================

EXPLAIN
SELECT *
FROM students
WHERE roll_number = 'MTCS001';


-- ============================================
-- 12. FUNCTION TEST
-- ============================================

SELECT
    get_attendance_percentage(1)
    AS attendance_percentage;