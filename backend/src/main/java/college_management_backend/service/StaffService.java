package college_management_backend.service;

import college_management_backend.dto.StaffProfileUpdateRequest;
import college_management_backend.dto.StaffRequest;
import college_management_backend.dto.StaffResponse;
import college_management_backend.entity.Staff;
import college_management_backend.entity.User;
import college_management_backend.repository.DepartmentRepository;
import college_management_backend.repository.StaffRepository;
import college_management_backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    private final UserRepository userRepository;

    private final DepartmentRepository departmentRepository;

    public StaffService(
            StaffRepository staffRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository) {

        this.staffRepository =
                staffRepository;

        this.userRepository =
                userRepository;

        this.departmentRepository =
                departmentRepository;
    }


    // =========================================================
    // GET ALL STAFF
    // =========================================================

    public List<StaffResponse> getAllStaff() {

        return staffRepository
                .findAll()
                .stream()
                .map(StaffResponse::new)
                .toList();
    }


    // =========================================================
    // GET STAFF BY ID
    // =========================================================

    public StaffResponse getStaffById(
            Long staffId) {

        Staff staff =
                staffRepository
                        .findById(staffId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Staff not found with id: "
                                                + staffId
                                )
                        );

        return new StaffResponse(staff);
    }


    // =========================================================
    // GET STAFF BY USER ID
    // =========================================================

    public StaffResponse getStaffByUserId(
            Long userId) {

        Staff staff =
                staffRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Staff not found for user id: "
                                                + userId
                                )
                        );

        return new StaffResponse(staff);
    }


    // =========================================================
    // GET STAFF BY USERNAME
    // =========================================================

    public StaffResponse getStaffByUsername(
            String username) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                                + username
                                )
                        );

        return getStaffByUserId(
                user.getUserId()
        );
    }


    // =========================================================
    // STAFF - UPDATE OWN PROFILE
    // =========================================================

    @Transactional
    public StaffResponse updateMyProfile(
            String username,
            StaffProfileUpdateRequest request) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                                + username
                                )
                        );

        Staff staff =
                staffRepository
                        .findByUserId(
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Staff profile not found"
                                )
                        );

        if (
                request.getFirstName() == null
                        ||
                request.getFirstName()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "First name is required"
            );
        }

        staff.setFirstName(
                request.getFirstName().trim()
        );

        if (request.getLastName() != null) {

            staff.setLastName(
                    request.getLastName().trim()
            );
        }

        if (request.getPhone() != null) {

            staff.setPhone(
                    request.getPhone().trim()
            );
        }

        if (request.getDesignation() != null) {

            staff.setDesignation(
                    request.getDesignation().trim()
            );
        }

        return new StaffResponse(
                staffRepository.save(staff)
        );
    }


    // =========================================================
    // ADMIN - CREATE STAFF
    // =========================================================

    public StaffResponse createStaff(
            StaffRequest request) {

        validateRequest(request);

        User user =
                userRepository
                        .findById(
                                request.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + request.getUserId()
                                )
                        );

        if (!hasStaffRole(user.getUserId())) {

            throw new RuntimeException(
                    "Selected user does not have STAFF role"
            );
        }

        if (
                staffRepository.existsByUserId(
                        request.getUserId()
                )
        ) {

            throw new RuntimeException(
                    "Staff already exists for user id: "
                            + request.getUserId()
            );
        }

        if (
                staffRepository.existsByEmployeeNumber(
                        request.getEmployeeNumber()
                )
        ) {

            throw new RuntimeException(
                    "Employee number already exists: "
                            + request.getEmployeeNumber()
            );
        }

        validateDepartment(
                request.getDepartmentId()
        );

        Staff staff =
                new Staff();

        staff.setUserId(
                request.getUserId()
        );

        staff.setEmployeeNumber(
                request.getEmployeeNumber()
        );

        staff.setFirstName(
                request.getFirstName()
        );

        staff.setLastName(
                request.getLastName()
        );

        staff.setPhone(
                request.getPhone()
        );

        staff.setDesignation(
                request.getDesignation()
        );

        staff.setDepartmentId(
                request.getDepartmentId()
        );

        staff.setJoiningDate(
                request.getJoiningDate()
        );

        staff.setStaffStatus(
                request.getStaffStatus()
        );

        Staff savedStaff =
                staffRepository.save(staff);

        return new StaffResponse(
                savedStaff
        );
    }


    // =========================================================
    // ADMIN - UPDATE STAFF
    // =========================================================

    public StaffResponse updateStaff(
            Long staffId,
            StaffRequest request) {

        validateRequest(request);

        Staff staff =
                staffRepository
                        .findById(staffId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Staff not found with id: "
                                                + staffId
                                )
                        );

        userRepository
                .findById(
                        request.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + request.getUserId()
                        )
                );

        if (!hasStaffRole(
                request.getUserId()
        )) {

            throw new RuntimeException(
                    "Selected user does not have STAFF role"
            );
        }

        if (
                !staff.getUserId()
                        .equals(request.getUserId())
                        &&
                staffRepository.existsByUserId(
                        request.getUserId()
                )
        ) {

            throw new RuntimeException(
                    "Another staff already exists for user id: "
                            + request.getUserId()
            );
        }

        if (
                !staff.getEmployeeNumber()
                        .equals(
                                request.getEmployeeNumber()
                        )
                        &&
                staffRepository.existsByEmployeeNumber(
                        request.getEmployeeNumber()
                )
        ) {

            throw new RuntimeException(
                    "Another staff already exists with employee number: "
                            + request.getEmployeeNumber()
            );
        }

        validateDepartment(
                request.getDepartmentId()
        );

        staff.setUserId(
                request.getUserId()
        );

        staff.setEmployeeNumber(
                request.getEmployeeNumber()
        );

        staff.setFirstName(
                request.getFirstName()
        );

        staff.setLastName(
                request.getLastName()
        );

        staff.setPhone(
                request.getPhone()
        );

        staff.setDesignation(
                request.getDesignation()
        );

        staff.setDepartmentId(
                request.getDepartmentId()
        );

        staff.setJoiningDate(
                request.getJoiningDate()
        );

        staff.setStaffStatus(
                request.getStaffStatus()
        );

        Staff updatedStaff =
                staffRepository.save(staff);

        return new StaffResponse(
                updatedStaff
        );
    }


    // =========================================================
    // ADMIN - DELETE STAFF
    // =========================================================

    public void deleteStaff(
            Long staffId) {

        if (
                !staffRepository.existsById(
                        staffId
                )
        ) {

            throw new RuntimeException(
                    "Staff not found with id: "
                            + staffId
            );
        }

        staffRepository.deleteById(
                staffId
        );
    }


    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateRequest(
            StaffRequest request) {

        if (request.getUserId() == null) {

            throw new RuntimeException(
                    "User ID is required"
            );
        }

        if (
                request.getEmployeeNumber() == null
                        ||
                request.getEmployeeNumber()
                        .isBlank()
        ) {

            throw new RuntimeException(
                    "Employee number is required"
            );
        }

        if (
                request.getFirstName() == null
                        ||
                request.getFirstName()
                        .isBlank()
        ) {

            throw new RuntimeException(
                    "First name is required"
            );
        }

        if (
                request.getStaffStatus() == null
                        ||
                request.getStaffStatus()
                        .isBlank()
        ) {

            throw new RuntimeException(
                    "Staff status is required"
            );
        }
    }


    private void validateDepartment(
            Long departmentId) {

        if (departmentId == null) {
            return;
        }

        if (
                !departmentRepository
                        .existsById(
                                departmentId
                        )
        ) {

            throw new RuntimeException(
                    "Department not found with id: "
                            + departmentId
            );
        }
    }


    private boolean hasStaffRole(
            Long userId) {

        return userRepository
                .findStaffUserIds()
                .stream()
                .anyMatch(
                        id -> id.equals(userId)
                );
    }
}