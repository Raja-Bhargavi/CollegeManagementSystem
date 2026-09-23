package college_management_backend.repository;

import college_management_backend.entity.Role;
import college_management_backend.entity.UserRole;
import college_management_backend.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

    List<UserRole> findByUserId(Long userId);

    @Query("""
           SELECT r.roleName
           FROM Role r
           JOIN UserRole ur ON ur.roleId = r.roleId
           WHERE ur.userId = :userId
           """)
    List<String> findRoleNamesByUserId(@Param("userId") Long userId);
}