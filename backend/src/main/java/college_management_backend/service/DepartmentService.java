package college_management_backend.service;

import college_management_backend.dto.DepartmentRequest;
import college_management_backend.dto.DepartmentResponse;
import college_management_backend.entity.Department;
import college_management_backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DepartmentResponse getDepartmentById(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException("Department not found with id: " + departmentId));

        return toResponse(department);
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {

        if (departmentRepository.existsByDepartmentCode(request.getDepartmentCode())) {
            throw new RuntimeException(
                    "Department code already exists: " + request.getDepartmentCode()
            );
        }

        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new RuntimeException(
                    "Department name already exists: " + request.getDepartmentName()
            );
        }

        Department department = new Department();

        department.setDepartmentCode(request.getDepartmentCode());
        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());

        Department savedDepartment = departmentRepository.save(department);

        return toResponse(savedDepartment);
    }

    public DepartmentResponse updateDepartment(
            Long departmentId,
            DepartmentRequest request
    ) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException("Department not found with id: " + departmentId));

        departmentRepository.findByDepartmentCode(request.getDepartmentCode())
                .ifPresent(existing -> {
                    if (!existing.getDepartmentId().equals(departmentId)) {
                        throw new RuntimeException(
                                "Department code already exists: "
                                        + request.getDepartmentCode()
                        );
                    }
                });

        departmentRepository.findByDepartmentName(request.getDepartmentName())
                .ifPresent(existing -> {
                    if (!existing.getDepartmentId().equals(departmentId)) {
                        throw new RuntimeException(
                                "Department name already exists: "
                                        + request.getDepartmentName()
                        );
                    }
                });

        department.setDepartmentCode(request.getDepartmentCode());
        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());

        Department updatedDepartment = departmentRepository.save(department);

        return toResponse(updatedDepartment);
    }

    public void deleteDepartment(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException("Department not found with id: " + departmentId));

        departmentRepository.delete(department);
    }

    private DepartmentResponse toResponse(Department department) {

        return new DepartmentResponse(
                department.getDepartmentId(),
                department.getDepartmentCode(),
                department.getDepartmentName(),
                department.getDescription()
        );
    }
}