-- initial roles/departments/courses


USE college_management;


-- =========================================================
-- ROLES
-- =========================================================

INSERT INTO roles
(role_name, description)
VALUES
('STUDENT', 'Student user'),
('FACULTY', 'Faculty user'),
('STAFF', 'Administrative staff user'),
('ADMIN', 'System administrator'),
('MANAGEMENT', 'Management user');


-- =========================================================
-- PERMISSIONS
-- =========================================================

INSERT INTO permissions
(permission_name, description)
VALUES
('VIEW_PROFILE', 'View user profile'),
('EDIT_PROFILE', 'Edit user profile'),
('VIEW_ATTENDANCE', 'View attendance'),
('UPDATE_ATTENDANCE', 'Update attendance'),
('VIEW_MARKS', 'View marks'),
('ENTER_MARKS', 'Enter marks'),
('REGISTER_COURSE', 'Register for courses'),
('APPROVE_REQUEST', 'Approve applications or requests'),
('MANAGE_USERS', 'Create and manage users'),
('VIEW_REPORTS', 'View institutional reports');


-- =========================================================
-- DEPARTMENTS
-- =========================================================

INSERT INTO departments
(department_code, department_name, description)
VALUES
('CSE',
 'Computer Science and Engineering',
 'Department of Computer Science and Engineering'),

('ECE',
 'Electronics and Communication Engineering',
 'Department of Electronics and Communication Engineering'),

('EEE',
 'Electrical and Electronics Engineering',
 'Department of Electrical and Electronics Engineering'),

('ME',
 'Mechanical Engineering',
 'Department of Mechanical Engineering');


-- =========================================================
-- PROGRAMS
-- =========================================================

INSERT INTO programs
(program_code, program_name, degree_type, duration_years, department_id)
VALUES
('BTECH-CSE',
 'B.Tech Computer Science and Engineering',
 'B.Tech',
 4.0,
 1),

('MTECH-CSE',
 'M.Tech Computer Science and Engineering',
 'M.Tech',
 2.0,
 1),

('MTECH-AI',
 'M.Tech Artificial Intelligence',
 'M.Tech',
 2.0,
 1);


-- =========================================================
-- COURSES
-- =========================================================

INSERT INTO courses
(course_code, course_name, credits, description)
VALUES
('CS501',
 'Advanced Database Management Systems',
 4.0,
 'Advanced concepts of database management systems'),

('CS502',
 'Machine Learning',
 4.0,
 'Fundamentals and advanced concepts of machine learning'),

('CS503',
 'Computer Networks',
 3.0,
 'Computer networking concepts and protocols'),

('CS504',
 'Cryptography',
 3.0,
 'Classical, modern and post-quantum cryptography');


-- =========================================================
-- SEMESTER
-- =========================================================

INSERT INTO semesters
(academic_year, semester_number, start_date, end_date, status)
VALUES
('2026-27',
 3,
 '2026-07-01',
 '2026-12-31',
 'ACTIVE');