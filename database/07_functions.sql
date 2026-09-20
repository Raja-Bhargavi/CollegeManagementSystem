--calculations

USE college_management;

-- ============================================
-- 07_functions.sql
-- User Defined Functions
-- ============================================


-- ============================================
-- 1. CALCULATE ATTENDANCE PERCENTAGE
-- ============================================

DROP FUNCTION IF EXISTS get_attendance_percentage;

DELIMITER $$

CREATE FUNCTION get_attendance_percentage(
    p_registration_id BIGINT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN

    DECLARE v_total INT DEFAULT 0;
    DECLARE v_present INT DEFAULT 0;
    DECLARE v_percentage DECIMAL(5,2);


    -- Count total attendance records
    SELECT COUNT(*)
    INTO v_total
    FROM attendance
    WHERE registration_id = p_registration_id;


    -- Count present records
    SELECT COUNT(*)
    INTO v_present
    FROM attendance
    WHERE registration_id = p_registration_id
      AND status = 'PRESENT';


    -- Avoid division by zero
    IF v_total = 0 THEN

        SET v_percentage = 0;

    ELSE

        SET v_percentage =
            ROUND((v_present * 100.0) / v_total, 2);

    END IF;


    RETURN v_percentage;

END$$

DELIMITER ;