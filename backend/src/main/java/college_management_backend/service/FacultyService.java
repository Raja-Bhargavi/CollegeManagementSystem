package college_management_backend.service;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.entity.Faculty;
import college_management_backend.entity.User;
import college_management_backend.repository.FacultyRepository;
import college_management_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    public FacultyService(
            FacultyRepository facultyRepository,
            UserRepository userRepository) {

        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL FACULTY
    // =========================================================

    public List<FacultyResponse> getAllFaculty() {

        return facultyRepository.findAll()
                .stream()
                .map(faculty -> {

                    User user =
                            userRepository
                                    .findById(faculty.getUserId())
                                    .orElse(null);

                    String email =
                            user != null
                                    ? user.getEmail()
                                    : null;

                    return new FacultyResponse(
                            faculty,
                            email
                    );
                })
                .toList();
    }

    // =========================================================
    // GET FACULTY BY ID
    // =========================================================

    public FacultyResponse getFacultyById(
            Long facultyId) {

        Faculty faculty =
                facultyRepository
                        .findById(facultyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found with id: "
                                                + facultyId
                                )
                        );

        return toResponse(faculty);
    }

    // =========================================================
    // GET FACULTY BY USER ID
    // =========================================================

    public FacultyResponse getFacultyByUserId(
            Long userId) {

        Faculty faculty =
                facultyRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found for user id: "
                                                + userId
                                )
                        );

        return toResponse(faculty);
    }

    // =========================================================
    // GET FACULTY BY USERNAME
    // =========================================================

    public FacultyResponse getFacultyByUsername(
            String username) {

        Long userId =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                                + username
                                )
                        )
                        .getUserId();

        return getFacultyByUserId(userId);
    }

    // =========================================================
    // CREATE FACULTY
    // ADMIN / STAFF
    // =========================================================

    @Transactional
    public FacultyResponse createFaculty(
            FacultyRequest request) {

        if (request.getUserId() == null) {
            throw new RuntimeException(
                    "User ID is required"
            );
        }

        if (request.getEmployeeNumber() == null
                || request.getEmployeeNumber().isBlank()) {

            throw new RuntimeException(
                    "Employee number is required"
            );
        }

        if (request.getFirstName() == null
                || request.getFirstName().isBlank()) {

            throw new RuntimeException(
                    "First name is required"
            );
        }

        if (request.getDepartmentId() == null) {

            throw new RuntimeException(
                    "Department ID is required"
            );
        }

        if (request.getFacultyStatus() == null
                || request.getFacultyStatus().isBlank()) {

            throw new RuntimeException(
                    "Faculty status is required"
            );
        }

        User user =
                userRepository
                        .findById(request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + request.getUserId()
                                )
                        );

        if (facultyRepository
                .existsByUserId(request.getUserId())) {

            throw new RuntimeException(
                    "Faculty already exists for user id: "
                            + request.getUserId()
            );
        }

        if (facultyRepository
                .existsByEmployeeNumber(
                        request.getEmployeeNumber())) {

            throw new RuntimeException(
                    "Employee number already exists: "
                            + request.getEmployeeNumber()
            );
        }

        Faculty faculty =
                new Faculty();

        faculty.setUserId(
                request.getUserId()
        );

        faculty.setEmployeeNumber(
                request.getEmployeeNumber()
        );

        faculty.setFirstName(
                request.getFirstName()
        );

        faculty.setLastName(
                request.getLastName()
        );

        faculty.setPhone(
                request.getPhone()
        );

        faculty.setDesignation(
                request.getDesignation()
        );

        faculty.setDepartmentId(
                request.getDepartmentId()
        );

        faculty.setJoiningDate(
                request.getJoiningDate()
        );

        faculty.setFacultyStatus(
                request.getFacultyStatus()
        );

        // Update email when supplied.
        if (request.getEmail() != null
                && !request.getEmail().isBlank()) {

            user.setEmail(
                    request.getEmail()
            );

            user.setUpdatedAt(
                    java.time.LocalDateTime.now()
            );

            userRepository.save(user);
        }

        Faculty savedFaculty =
                facultyRepository.save(faculty);

        return toResponse(savedFaculty);
    }

    // =========================================================
    // ADMIN / STAFF - FULL UPDATE
    // =========================================================

    @Transactional
    public FacultyResponse updateFaculty(
            Long facultyId,
            FacultyRequest request) {

        Faculty faculty =
                facultyRepository
                        .findById(facultyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found with id: "
                                                + facultyId
                                )
                        );

        if (request.getUserId() == null) {

            throw new RuntimeException(
                    "User ID is required"
            );
        }

        if (!faculty.getUserId().equals(
                request.getUserId())
                && facultyRepository.existsByUserId(
                        request.getUserId())) {

            throw new RuntimeException(
                    "Another faculty already exists for user id: "
                            + request.getUserId()
            );
        }

        if (request.getEmployeeNumber() == null
                || request.getEmployeeNumber().isBlank()) {

            throw new RuntimeException(
                    "Employee number is required"
            );
        }

        if (!faculty.getEmployeeNumber().equals(
                request.getEmployeeNumber())
                && facultyRepository.existsByEmployeeNumber(
                        request.getEmployeeNumber())) {

            throw new RuntimeException(
                    "Another faculty already exists with employee number: "
                            + request.getEmployeeNumber()
            );
        }

        User user =
                userRepository
                        .findById(request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + request.getUserId()
                                )
                        );

        faculty.setUserId(
                request.getUserId()
        );

        faculty.setEmployeeNumber(
                request.getEmployeeNumber()
        );

        faculty.setFirstName(
                request.getFirstName()
        );

        faculty.setLastName(
                request.getLastName()
        );

        faculty.setPhone(
                request.getPhone()
        );

        faculty.setDesignation(
                request.getDesignation()
        );

        faculty.setDepartmentId(
                request.getDepartmentId()
        );

        faculty.setJoiningDate(
                request.getJoiningDate()
        );

        faculty.setFacultyStatus(
                request.getFacultyStatus()
        );

        if (request.getEmail() != null
                && !request.getEmail().isBlank()) {

            user.setEmail(
                    request.getEmail()
            );

            user.setUpdatedAt(
                    java.time.LocalDateTime.now()
            );

            userRepository.save(user);
        }

        Faculty updatedFaculty =
                facultyRepository.save(faculty);

        return toResponse(updatedFaculty);
    }

    // =========================================================
    // FACULTY - UPDATE OWN PROFILE
    // =========================================================

    @Transactional
    public FacultyResponse updateMyProfile(
            String username,
            FacultyRequest request) {

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found: "
                                                + username
                                )
                        );

        Faculty faculty =
                facultyRepository
                        .findByUserId(
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty profile not found"
                                )
                        );

        // -----------------------------------------------------
        // Only personal profile fields can be changed.
        // -----------------------------------------------------

        if (request.getFirstName() != null
                && !request.getFirstName().isBlank()) {

            faculty.setFirstName(
                    request.getFirstName()
            );
        }

        if (request.getLastName() != null) {

            faculty.setLastName(
                    request.getLastName()
            );
        }

        if (request.getPhone() != null) {

            faculty.setPhone(
                    request.getPhone()
            );
        }

        // -----------------------------------------------------
        // Email belongs to users table.
        // -----------------------------------------------------

        if (request.getEmail() != null
                && !request.getEmail().isBlank()) {

            String newEmail =
                    request.getEmail().trim();

            // Prevent email collision with another user.
            userRepository
                    .findByEmail(newEmail)
                    .ifPresent(existingUser -> {

                        if (!existingUser.getUserId()
                                .equals(user.getUserId())) {

                            throw new RuntimeException(
                                    "Email is already used by another user"
                            );
                        }
                    });

            user.setEmail(newEmail);

            user.setUpdatedAt(
                    java.time.LocalDateTime.now()
            );

            userRepository.save(user);
        }

        Faculty updatedFaculty =
                facultyRepository.save(faculty);

        return toResponse(updatedFaculty);
    }

    // =========================================================
    // DELETE FACULTY
    // ADMIN
    // =========================================================

    public void deleteFaculty(
            Long facultyId) {

        if (!facultyRepository
                .existsById(facultyId)) {

            throw new RuntimeException(
                    "Faculty not found with id: "
                            + facultyId
            );
        }

        facultyRepository.deleteById(
                facultyId
        );
    }

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private FacultyResponse toResponse(
            Faculty faculty) {

        User user =
                userRepository
                        .findById(
                                faculty.getUserId()
                        )
                        .orElse(null);

        String email =
                user != null
                        ? user.getEmail()
                        : null;

        return new FacultyResponse(
                faculty,
                email
        );
    }
}