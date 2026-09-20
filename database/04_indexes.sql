-- performance

USE college_management;

-- ============================================
-- 04_indexes.sql
-- Indexes for frequently searched/joined columns
-- ============================================

-- STUDENTS
CREATE INDEX idx_students_program
ON students(program_id);

CREATE INDEX idx_students_semester_status
ON students(current_semester, student_status);


-- FACULTY
CREATE INDEX idx_faculty_department
ON faculty(department_id);


-- COURSE OFFERINGS
CREATE INDEX idx_offering_course
ON course_offerings(course_id);

CREATE INDEX idx_offering_section
ON course_offerings(section_id);

CREATE INDEX idx_offering_faculty
ON course_offerings(faculty_id);


-- COURSE REGISTRATIONS
CREATE INDEX idx_registration_student
ON course_registrations(student_id);

CREATE INDEX idx_registration_offering
ON course_registrations(offering_id);


-- ATTENDANCE
CREATE INDEX idx_attendance_registration
ON attendance(registration_id);

CREATE INDEX idx_attendance_date
ON attendance(attendance_date);


-- EXAMINATIONS
CREATE INDEX idx_exam_offering
ON examinations(offering_id);


-- MARKS
CREATE INDEX idx_marks_student
ON marks(student_id);

CREATE INDEX idx_marks_exam
ON marks(exam_id);


-- APPLICATIONS
CREATE INDEX idx_application_user
ON applications(applicant_user_id);

CREATE INDEX idx_application_status
ON applications(status);


-- APPROVALS
CREATE INDEX idx_approval_application
ON approvals(application_id);

CREATE INDEX idx_approval_user
ON approvals(approver_user_id);


-- NOTIFICATIONS
CREATE INDEX idx_notification_user
ON notifications(user_id);

CREATE INDEX idx_notification_read
ON notifications(read_status);


-- FEES
CREATE INDEX idx_fee_student
ON fees(student_id);

CREATE INDEX idx_fee_semester
ON fees(semester_id);


-- PAYMENTS
CREATE INDEX idx_payment_fee
ON payments(fee_id);


-- AUDIT LOGS
CREATE INDEX idx_audit_user
ON audit_logs(user_id);

CREATE INDEX idx_audit_table_record
ON audit_logs(table_name, record_id);

CREATE INDEX idx_audit_timestamp
ON audit_logs(timestamp);