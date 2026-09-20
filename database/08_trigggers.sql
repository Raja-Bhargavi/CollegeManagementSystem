--automatic actions

USE college_management;

-- ============================================
-- 08_triggers.sql
-- Database Triggers
-- ============================================


-- ============================================
-- 1. VALIDATE MARKS BEFORE INSERT
-- ============================================

DROP TRIGGER IF EXISTS before_marks_insert;

DELIMITER $$

CREATE TRIGGER before_marks_insert
BEFORE INSERT ON marks
FOR EACH ROW
BEGIN

    DECLARE v_maximum_marks DECIMAL(6,2);


    SELECT maximum_marks
    INTO v_maximum_marks
    FROM examinations
    WHERE exam_id = NEW.exam_id;


    IF NEW.marks_obtained < 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Marks cannot be negative';

    END IF;


    IF NEW.marks_obtained > v_maximum_marks THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'Marks cannot exceed maximum marks';

    END IF;

END$$

DELIMITER ;


-- ============================================
-- 2. AUDIT STUDENT UPDATES
-- ============================================

DROP TRIGGER IF EXISTS after_student_update;

DELIMITER $$

CREATE TRIGGER after_student_update
AFTER UPDATE ON students
FOR EACH ROW
BEGIN

    INSERT INTO audit_logs
    (
        user_id,
        action,
        table_name,
        record_id,
        old_value,
        new_value,
        timestamp
    )
    VALUES
    (
        NULL,
        'UPDATE',
        'students',
        NEW.student_id,

        JSON_OBJECT(
            'roll_number', OLD.roll_number,
            'current_semester', OLD.current_semester,
            'student_status', OLD.student_status
        ),

        JSON_OBJECT(
            'roll_number', NEW.roll_number,
            'current_semester', NEW.current_semester,
            'student_status', NEW.student_status
        ),

        NOW()
    );

END$$

DELIMITER ;