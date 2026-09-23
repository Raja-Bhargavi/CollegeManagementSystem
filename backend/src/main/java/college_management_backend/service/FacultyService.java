package college_management_backend.service;

import college_management_backend.dto.FacultyRequest;
import college_management_backend.dto.FacultyResponse;
import college_management_backend.entity.Faculty;
import college_management_backend.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
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
                        new RuntimeException("Faculty not found with id: " + facultyId));

        return new FacultyResponse(faculty);
    }

    public FacultyResponse getFacultyByUserId(Long userId) {
        Faculty faculty = facultyRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found for user id: " + userId));

        return new FacultyResponse(faculty);
    }

    public FacultyResponse createFaculty(FacultyRequest request) {

        if (facultyRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException(
                    "Faculty already exists for user id: " + request.getUserId()
            );
        }

        if (facultyRepository.existsByEmployeeNumber(request.getEmployeeNumber())) {
            throw new RuntimeException(
                    "Employee number already exists: " + request.getEmployeeNumber()
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

    public FacultyResponse updateFaculty(Long facultyId, FacultyRequest request) {

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found with id: " + facultyId));

        if (!faculty.getUserId().equals(request.getUserId())
                && facultyRepository.existsByUserId(request.getUserId())) {

            throw new RuntimeException(
                    "Another faculty already exists for user id: " + request.getUserId()
            );
        }

        if (!faculty.getEmployeeNumber().equals(request.getEmployeeNumber())
                && facultyRepository.existsByEmployeeNumber(request.getEmployeeNumber())) {

            throw new RuntimeException(
                    "Another faculty already exists with employee number: "
                            + request.getEmployeeNumber()
            );
        }

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