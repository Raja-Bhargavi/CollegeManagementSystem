-- database operations

USE college_management;

-- ============================================
-- 06_procedures.sql
-- Stored Procedures
-- ============================================


-- ============================================
-- 1. REGISTER STUDENT FOR A COURSE
-- ============================================

DROP PROCEDURE IF EXISTS register_student_for_course;

DELIMITER $$

CREATE PROCEDURE register_student_for_course(
    IN p_student_id BIGINT,
    IN p_offering_id BIGINT
)
BEGIN

    DECLARE v_student_status VARCHAR(20);
    DECLARE v_offering_status VARCHAR(20);
    DECLARE v_count INT;

    -- Check whether the student exists and is active
    SELECT student_status
    INTO v_student_status
    FROM students
    WHERE student_id = p_student_id;

    IF v_student_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student does not exist';

    ELSEIF v_student_status <> 'ACTIVE' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student is not active';

    END IF;


    -- Check whether the course offering exists and is active
    SELECT offering_status
    INTO v_offering_status
    FROM course_offerings
    WHERE offering_id = p_offering_id;

    IF v_offering_status IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course offering does not exist';

    ELSEIF v_offering_status <> 'ACTIVE' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course offering is not active';

    END IF;


    -- Check for duplicate registration
    SELECT COUNT(*)
    INTO v_count
    FROM course_registrations
    WHERE student_id = p_student_id
      AND offering_id = p_offering_id;


    IF v_count > 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student is already registered for this course';

    ELSE

        INSERT INTO course_registrations
        (
            student_id,
            offering_id,
            registration_date,
            status
        )
        VALUES
        (
            p_student_id,
            p_offering_id,
            NOW(),
            'REGISTERED'
        );

    END IF;

END$$

DELIMITER ;


-- ============================================
-- 2. PUBLISH STUDENT RESULT
-- ============================================

DROP PROCEDURE IF EXISTS publish_student_result;

DELIMITER $$

CREATE PROCEDURE publish_student_result(
    IN p_student_id BIGINT,
    IN p_semester_id BIGINT,
    IN p_sgpa DECIMAL(4,2),
    IN p_cgpa DECIMAL(4,2)
)
BEGIN

    DECLARE v_student_count INT;
    DECLARE v_semester_count INT;

    -- Check student
    SELECT COUNT(*)
    INTO v_student_count
    FROM students
    WHERE student_id = p_student_id;

    IF v_student_count = 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student does not exist';

    END IF;


    -- Check semester
    SELECT COUNT(*)
    INTO v_semester_count
    FROM semesters
    WHERE semester_id = p_semester_id;

    IF v_semester_count = 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Semester does not exist';

    END IF;


    -- Validate SGPA and CGPA
    IF p_sgpa < 0 OR p_sgpa > 10 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'SGPA must be between 0 and 10';

    END IF;


    IF p_cgpa < 0 OR p_cgpa > 10 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'CGPA must be between 0 and 10';

    END IF;


    -- Insert or update result
    INSERT INTO results
    (
        student_id,
        semester_id,
        sgpa,
        cgpa,
        result_status,
        published_at
    )
    VALUES
    (
        p_student_id,
        p_semester_id,
        p_sgpa,
        p_cgpa,
        'PUBLISHED',
        NOW()
    )

    ON DUPLICATE KEY UPDATE

        sgpa = p_sgpa,
        cgpa = p_cgpa,
        result_status = 'PUBLISHED',
        published_at = NOW();

END$$

DELIMITER ;