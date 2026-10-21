package college_management_backend.repository;

import college_management_backend.dto.FacultyAccountOption;
import college_management_backend.dto.UserAccountOption;
import college_management_backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query(value = """
            SELECT
                u.user_id AS userId,
                u.username AS username,
                u.email AS email
            FROM users u
            INNER JOIN user_roles ur
                ON u.user_id = ur.user_id
            WHERE ur.role_id = 1
              AND u.account_status = 'ACTIVE'
              AND (
                    (
                        :includeUserId IS NOT NULL
                        AND u.user_id = :includeUserId
                    )
                    OR NOT EXISTS (
                        SELECT 1
                        FROM students s
                        WHERE s.user_id = u.user_id
                    )
              )
            ORDER BY u.username
            """, nativeQuery = true)
    List<UserAccountOption> findAvailableStudentAccounts(
            @Param("includeUserId") Long includeUserId
    );

    @Query(value = """
            SELECT
                u.user_id AS userId,
                u.username AS username,
                u.email AS email
            FROM users u
            INNER JOIN user_roles ur
                ON u.user_id = ur.user_id
            WHERE ur.role_id = 2
              AND u.account_status = 'ACTIVE'
              AND (
                    (
                        :includeUserId IS NOT NULL
                        AND u.user_id = :includeUserId
                    )
                    OR NOT EXISTS (
                        SELECT 1
                        FROM faculty f
                        WHERE f.user_id = u.user_id
                    )
              )
            ORDER BY u.username
            """, nativeQuery = true)
    List<FacultyAccountOption> findAvailableFacultyAccounts(
            @Param("includeUserId") Long includeUserId
    );

    @Query(value = """
        SELECT u.user_id
        FROM users u
        INNER JOIN user_roles ur
            ON u.user_id = ur.user_id
        WHERE ur.role_id = 3
        """, nativeQuery = true)
    List<Long> findStaffUserIds();

    @Query(value = """
        SELECT
            u.user_id AS userId,
            u.username AS username,
            u.email AS email
        FROM users u
        INNER JOIN user_roles ur
            ON u.user_id = ur.user_id
        WHERE ur.role_id = 3
          AND u.account_status = 'ACTIVE'
          AND (
                (
                    :includeUserId IS NOT NULL
                    AND u.user_id = :includeUserId
                )
                OR NOT EXISTS (
                    SELECT 1
                    FROM staff s
                    WHERE s.user_id = u.user_id
                )
          )
        ORDER BY u.username
        """, nativeQuery = true)
    List<UserAccountOption> findAvailableStaffAccounts(
            @Param("includeUserId") Long includeUserId
    );

            
        @Query(value = """
                SELECT COUNT(*)
                FROM user_roles ur
                JOIN roles r ON r.role_id = ur.role_id
                WHERE ur.user_id = :userId
                AND r.role_name = :roleName
                """, nativeQuery = true)
            long hasRole(
                    @Param("userId") Long userId,
                    @Param("roleName") String roleName
            );

        @Query(value = """
            SELECT COUNT(*)
            FROM users u
            WHERE u.user_id = :userId
            AND u.account_status = 'ACTIVE'
            """, nativeQuery = true)
        long isActiveUser(@Param("userId") Long userId);

        @Query(value = """
            SELECT COUNT(*)
            FROM students s
            WHERE s.user_id = :userId
            """, nativeQuery = true)
        long hasStudentProfile(@Param("userId") Long userId);

        @Query(value = """
            SELECT COUNT(*)
            FROM faculty f
            WHERE f.user_id = :userId
            """, nativeQuery = true)
        long hasFacultyProfile(@Param("userId") Long userId);

        @Query(value = """
            SELECT COUNT(*)
            FROM staff s
            WHERE s.user_id = :userId
            """, nativeQuery = true)
        long hasStaffProfile(@Param("userId") Long userId);

        @Query(value = """
            SELECT COUNT(*)
            FROM management m
            WHERE m.user_id = :userId
            """, nativeQuery = true)
        long hasManagementProfile(@Param("userId") Long userId);
        
        @Query(value = """
            SELECT COUNT(*) 
            FROM faculty f
            JOIN users u ON u.user_id = f.user_id
            WHERE LOWER(u.email) = LOWER(:email)
            """, nativeQuery = true)
        long countFacultyProfilesByEmail(@Param("email") String email);


        @Query(value = """
            SELECT COUNT(*) 
            FROM staff s
            JOIN users u ON u.user_id = s.user_id
            WHERE LOWER(u.email) = LOWER(:email)
            """, nativeQuery = true)
        long countStaffProfilesByEmail(@Param("email") String email);

        @Query(value = """
            SELECT COUNT(*) 
            FROM management m
            JOIN users u ON u.user_id = m.user_id
            WHERE LOWER(u.email) = LOWER(:email)
            """, nativeQuery = true)
        long countManagementProfilesByEmail(@Param("email") String email);


}
