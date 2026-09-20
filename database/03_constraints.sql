-- data integrity

USE college_management;


-- =========================================================
-- COURSE CONSTRAINTS
-- =========================================================

ALTER TABLE courses
ADD CONSTRAINT chk_course_credits
CHECK (credits > 0);


-- =========================================================
-- PROGRAM CONSTRAINTS
-- =========================================================

ALTER TABLE programs
ADD CONSTRAINT chk_program_duration
CHECK (duration_years > 0);


-- =========================================================
-- SEMESTER CONSTRAINTS
-- =========================================================

ALTER TABLE semesters
ADD CONSTRAINT chk_semester_number
CHECK (semester_number BETWEEN 1 AND 8);


-- =========================================================
-- STUDENT CONSTRAINTS
-- =========================================================

ALTER TABLE students
ADD CONSTRAINT chk_student_semester
CHECK (current_semester BETWEEN 1 AND 8);


-- =========================================================
-- FEE CONSTRAINTS
-- =========================================================

ALTER TABLE fees
ADD CONSTRAINT chk_fee_amount
CHECK (amount >= 0);


-- =========================================================
-- PAYMENT CONSTRAINTS
-- =========================================================

ALTER TABLE payments
ADD CONSTRAINT chk_payment_amount
CHECK (amount > 0);


-- =========================================================
-- MARK CONSTRAINTS
-- =========================================================

ALTER TABLE marks
ADD CONSTRAINT chk_marks_nonnegative
CHECK (marks_obtained >= 0);