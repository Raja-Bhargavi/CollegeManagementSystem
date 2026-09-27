package college_management_backend.service;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.entity.Faculty;
import college_management_backend.repository.FacultyRepository;
import college_management_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    public List<FacultyResponse> getAllFaculty() {

        return facultyRepository.findAll()
                .stream()
                .map(FacultyResponse::new)
                .toList();
    }

    public FacultyResponse getFacultyById(Long facultyId) {

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found with id: " + facultyId
                        ));

        return new FacultyResponse(faculty);
    }

    public FacultyResponse getFacultyByUserId(Long userId) {

        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found for user id: " + userId
                        ));

        return new FacultyResponse(faculty);
    }

    public FacultyResponse getFacultyByUsername(String username) {

        Long userId = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found: " + username
                        ))
                .getUserId();

        return getFacultyByUserId(userId);
    }

    public FacultyResponse createFaculty(FacultyRequest request) {

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (request.getEmployeeNumber() == null
                || request.getEmployeeNumber().isBlank()) {
            throw new RuntimeException("Employee number is required");
        }

        if (request.getFirstName() == null
                || request.getFirstName().isBlank()) {
            throw new RuntimeException("First name is required");
        }

        if (request.getDepartmentId() == null) {
            throw new RuntimeException("Department ID is required");
        }

        if (request.getFacultyStatus() == null
                || request.getFacultyStatus().isBlank()) {
            throw new RuntimeException("Faculty status is required");
        }

        userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + request.getUserId()
                        ));

        if (facultyRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException(
                    "Faculty already exists for user id: "
                            + request.getUserId()
            );
        }

        if (facultyRepository.existsByEmployeeNumber(
                request.getEmployeeNumber())) {

            throw new RuntimeException(
                    "Employee number already exists: "
                            + request.getEmployeeNumber()
            );
        }

        Faculty faculty = new Faculty();

        faculty.setUserId(request.getUserId());
        faculty.setEmployeeNumber(request.getEmployeeNumber());
        faculty.setFirstName(request.getFirstName());
        faculty.setLastName(request.getLastName());
        faculty.setPhone(request.getPhone());
        faculty.setDesignation(request.getDesignation());
        faculty.setDepartmentId(request.getDepartmentId());
        faculty.setJoiningDate(request.getJoiningDate());
        faculty.setFacultyStatus(request.getFacultyStatus());

        Faculty savedFaculty = facultyRepository.save(faculty);

        return new FacultyResponse(savedFaculty);
    }

    public FacultyResponse updateFaculty(
            Long facultyId,
            FacultyRequest request) {

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found with id: " + facultyId
                        ));

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (!faculty.getUserId().equals(request.getUserId())
                && facultyRepository.existsByUserId(request.getUserId())) {

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

        userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + request.getUserId()
                        ));

        faculty.setUserId(request.getUserId());
        faculty.setEmployeeNumber(request.getEmployeeNumber());
        faculty.setFirstName(request.getFirstName());
        faculty.setLastName(request.getLastName());
        faculty.setPhone(request.getPhone());
        faculty.setDesignation(request.getDesignation());
        faculty.setDepartmentId(request.getDepartmentId());
        faculty.setJoiningDate(request.getJoiningDate());
        faculty.setFacultyStatus(request.getFacultyStatus());

        Faculty updatedFaculty = facultyRepository.save(faculty);

        return new FacultyResponse(updatedFaculty);
    }

    public void deleteFaculty(Long facultyId) {

        if (!facultyRepository.existsById(facultyId)) {
            throw new RuntimeException(
                    "Faculty not found with id: " + facultyId
            );
        }

        facultyRepository.deleteById(facultyId);
    }
}
