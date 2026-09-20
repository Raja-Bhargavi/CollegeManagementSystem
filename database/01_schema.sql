-- tables

CREATE DATABASE IF NOT EXISTS college_management;

USE college_management;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,

    account_status VARCHAR(20) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 2. ROLES
-- =========================================================

CREATE TABLE roles (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    role_name VARCHAR(50) NOT NULL UNIQUE,

    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 3. PERMISSIONS
-- =========================================================

CREATE TABLE permissions (
    permission_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    permission_name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 4. DEPARTMENTS
-- =========================================================

CREATE TABLE departments (
    department_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    department_code VARCHAR(20) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 5. PROGRAMS
-- =========================================================

CREATE TABLE programs (
    program_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    program_code VARCHAR(30) NOT NULL UNIQUE,
    program_name VARCHAR(100) NOT NULL,

    degree_type VARCHAR(30) NOT NULL,
    duration_years DECIMAL(3,1) NOT NULL,

    department_id BIGINT NOT NULL,

    CONSTRAINT fk_program_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 6. SEMESTERS
-- =========================================================

CREATE TABLE semesters (
    semester_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    academic_year VARCHAR(9) NOT NULL,
    semester_number INT NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT uq_semester
        UNIQUE (academic_year, semester_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 7. STUDENTS
-- =========================================================

CREATE TABLE students (
    student_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL UNIQUE,

    roll_number VARCHAR(30) NOT NULL UNIQUE,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),

    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),

    program_id BIGINT NOT NULL,

    admission_year YEAR NOT NULL,
    current_semester INT NOT NULL,

    student_status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_student_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_student_program
        FOREIGN KEY (program_id)
        REFERENCES programs(program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 8. FACULTY
-- =========================================================

CREATE TABLE faculty (
    faculty_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL UNIQUE,

    employee_number VARCHAR(30) NOT NULL UNIQUE,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),

    phone VARCHAR(20),

    designation VARCHAR(100),

    department_id BIGINT NOT NULL,

    joining_date DATE,

    faculty_status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_faculty_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_faculty_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 9. STAFF
-- =========================================================

CREATE TABLE staff (
    staff_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL UNIQUE,

    employee_number VARCHAR(30) NOT NULL UNIQUE,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),

    phone VARCHAR(20),

    designation VARCHAR(100),

    department_id BIGINT,

    joining_date DATE,

    staff_status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_staff_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_staff_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 10. MANAGEMENT
-- =========================================================

CREATE TABLE management (
    management_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL UNIQUE,

    employee_number VARCHAR(30) NOT NULL UNIQUE,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),

    designation VARCHAR(100) NOT NULL,

    CONSTRAINT fk_management_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 11. USER ROLES
-- =========================================================

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_role_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_user_role_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 12. ROLE PERMISSIONS
-- =========================================================

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_role_permission_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id),

    CONSTRAINT fk_role_permission_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 13. SECTIONS
-- =========================================================

CREATE TABLE sections (
    section_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    section_name VARCHAR(20) NOT NULL,

    program_id BIGINT NOT NULL,
    semester_id BIGINT NOT NULL,

    CONSTRAINT fk_section_program
        FOREIGN KEY (program_id)
        REFERENCES programs(program_id),

    CONSTRAINT fk_section_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id),

    CONSTRAINT uq_section
        UNIQUE (program_id, semester_id, section_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 14. COURSES
-- =========================================================

CREATE TABLE courses (
    course_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    course_code VARCHAR(20) NOT NULL UNIQUE,

    course_name VARCHAR(150) NOT NULL,

    credits DECIMAL(3,1) NOT NULL,

    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 15. COURSE OFFERINGS
-- =========================================================

CREATE TABLE course_offerings (
    offering_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    course_id BIGINT NOT NULL,

    section_id BIGINT NOT NULL,

    faculty_id BIGINT NOT NULL,

    offering_status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_offering_course
        FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    CONSTRAINT fk_offering_section
        FOREIGN KEY (section_id)
        REFERENCES sections(section_id),

    CONSTRAINT fk_offering_faculty
        FOREIGN KEY (faculty_id)
        REFERENCES faculty(faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 16. COURSE REGISTRATIONS
-- =========================================================

CREATE TABLE course_registrations (
    registration_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    student_id BIGINT NOT NULL,

    offering_id BIGINT NOT NULL,

    registration_date DATETIME NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_registration_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    CONSTRAINT fk_registration_offering
        FOREIGN KEY (offering_id)
        REFERENCES course_offerings(offering_id),

    CONSTRAINT uq_student_offering
        UNIQUE (student_id, offering_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 17. ATTENDANCE
-- =========================================================

CREATE TABLE attendance (
    attendance_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    registration_id BIGINT NOT NULL,

    attendance_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL,

    marked_by BIGINT NOT NULL,

    marked_at DATETIME NOT NULL,

    CONSTRAINT fk_attendance_registration
        FOREIGN KEY (registration_id)
        REFERENCES course_registrations(registration_id),

    CONSTRAINT fk_attendance_user
        FOREIGN KEY (marked_by)
        REFERENCES users(user_id),

    CONSTRAINT uq_attendance
        UNIQUE (registration_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 18. EXAMINATIONS
-- =========================================================

CREATE TABLE examinations (
    exam_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    offering_id BIGINT NOT NULL,

    exam_type VARCHAR(30) NOT NULL,

    exam_date DATE NOT NULL,

    maximum_marks DECIMAL(6,2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_exam_offering
        FOREIGN KEY (offering_id)
        REFERENCES course_offerings(offering_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 19. MARKS
-- =========================================================

CREATE TABLE marks (
    mark_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    exam_id BIGINT NOT NULL,

    student_id BIGINT NOT NULL,

    marks_obtained DECIMAL(6,2) NOT NULL,

    remarks VARCHAR(255),

    CONSTRAINT fk_marks_exam
        FOREIGN KEY (exam_id)
        REFERENCES examinations(exam_id),

    CONSTRAINT fk_marks_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    CONSTRAINT uq_exam_student
        UNIQUE (exam_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 20. RESULTS
-- =========================================================

CREATE TABLE results (
    result_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    student_id BIGINT NOT NULL,

    semester_id BIGINT NOT NULL,

    sgpa DECIMAL(4,2),

    cgpa DECIMAL(4,2),

    result_status VARCHAR(20) NOT NULL,

    published_at DATETIME,

    CONSTRAINT fk_result_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    CONSTRAINT fk_result_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id),

    CONSTRAINT uq_student_semester_result
        UNIQUE (student_id, semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 21. APPLICATIONS
-- =========================================================

CREATE TABLE applications (
    application_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    applicant_user_id BIGINT NOT NULL,

    application_type VARCHAR(50) NOT NULL,

    subject VARCHAR(200) NOT NULL,

    description TEXT,

    submitted_at DATETIME,

    status VARCHAR(30) NOT NULL,

    CONSTRAINT fk_application_user
        FOREIGN KEY (applicant_user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 22. APPLICATION DOCUMENTS
-- =========================================================

CREATE TABLE application_documents (
    document_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    application_id BIGINT NOT NULL,

    document_name VARCHAR(150) NOT NULL,

    document_type VARCHAR(50),

    file_path VARCHAR(500) NOT NULL,

    uploaded_at DATETIME NOT NULL,

    CONSTRAINT fk_document_application
        FOREIGN KEY (application_id)
        REFERENCES applications(application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 23. APPROVALS
-- =========================================================

CREATE TABLE approvals (
    approval_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    application_id BIGINT NOT NULL,

    approver_user_id BIGINT NOT NULL,

    action VARCHAR(30) NOT NULL,

    comments TEXT,

    action_date DATETIME NOT NULL,

    CONSTRAINT fk_approval_application
        FOREIGN KEY (application_id)
        REFERENCES applications(application_id),

    CONSTRAINT fk_approval_user
        FOREIGN KEY (approver_user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 24. NOTICES
-- =========================================================

CREATE TABLE notices (
    notice_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(200) NOT NULL,

    content TEXT NOT NULL,

    created_by BIGINT NOT NULL,

    published_at DATETIME,

    expiry_date DATETIME,

    visibility VARCHAR(30) NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_notice_creator
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 25. EVENTS
-- =========================================================

CREATE TABLE events (
    event_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    event_date DATETIME NOT NULL,

    location VARCHAR(200),

    created_by BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_event_creator
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 26. NOTIFICATIONS
-- =========================================================

CREATE TABLE notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    created_at DATETIME NOT NULL,

    read_status BOOLEAN NOT NULL,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 27. FEES
-- =========================================================

CREATE TABLE fees (
    fee_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    student_id BIGINT NOT NULL,

    semester_id BIGINT NOT NULL,

    fee_type VARCHAR(50) NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    due_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_fee_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    CONSTRAINT fk_fee_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(semester_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 28. PAYMENTS
-- =========================================================

CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    fee_id BIGINT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    payment_date DATETIME NOT NULL,

    payment_method VARCHAR(30) NOT NULL,

    transaction_reference VARCHAR(100) UNIQUE,

    payment_status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_payment_fee
        FOREIGN KEY (fee_id)
        REFERENCES fees(fee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =========================================================
-- 29. AUDIT LOGS
-- =========================================================

CREATE TABLE audit_logs (
    audit_id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT,

    action VARCHAR(50) NOT NULL,

    table_name VARCHAR(100) NOT NULL,

    record_id BIGINT NOT NULL,

    old_value JSON,

    new_value JSON,

    timestamp DATETIME NOT NULL,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;