package college_management_backend.service;

import college_management_backend.dto.StaffRequest;
import college_management_backend.dto.StaffResponse;
import college_management_backend.entity.Staff;
import college_management_backend.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(StaffResponse::new)
                .toList();
    }

    public StaffResponse getStaffById(Long staffId) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Staff not found with id: " + staffId
                        ));

        return new StaffResponse(staff);
    }

    public StaffResponse getStaffByUserId(Long userId) {

        Staff staff = staffRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Staff not found for user id: " + userId
                        ));

        return new StaffResponse(staff);
    }

    public StaffResponse createStaff(StaffRequest request) {

        if (staffRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException(
                    "Staff already exists for user id: "
                            + request.getUserId()
            );
        }

        if (staffRepository.existsByEmployeeNumber(
                request.getEmployeeNumber())) {

            throw new RuntimeException(
                    "Employee number already exists: "
                            + request.getEmployeeNumber()
            );
        }

        Staff staff = new Staff();

        staff.setUserId(request.getUserId());
        staff.setEmployeeNumber(request.getEmployeeNumber());
        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setPhone(request.getPhone());
        staff.setDesignation(request.getDesignation());
        staff.setDepartmentId(request.getDepartmentId());
        staff.setJoiningDate(request.getJoiningDate());
        staff.setStaffStatus(request.getStaffStatus());

        Staff savedStaff = staffRepository.save(staff);

        return new StaffResponse(savedStaff);
    }

    public StaffResponse updateStaff(
            Long staffId,
            StaffRequest request) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Staff not found with id: " + staffId
                        ));

        if (!staff.getUserId().equals(request.getUserId())
                && staffRepository.existsByUserId(request.getUserId())) {

            throw new RuntimeException(
                    "Another staff already exists for user id: "
                            + request.getUserId()
            );
        }

        if (!staff.getEmployeeNumber().equals(
                request.getEmployeeNumber())
                && staffRepository.existsByEmployeeNumber(
                request.getEmployeeNumber())) {

            throw new RuntimeException(
                    "Another staff already exists with employee number: "
                            + request.getEmployeeNumber()
            );
        }

        staff.setUserId(request.getUserId());
        staff.setEmployeeNumber(request.getEmployeeNumber());
        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setPhone(request.getPhone());
        staff.setDesignation(request.getDesignation());
        staff.setDepartmentId(request.getDepartmentId());
        staff.setJoiningDate(request.getJoiningDate());
        staff.setStaffStatus(request.getStaffStatus());

        Staff updatedStaff = staffRepository.save(staff);

        return new StaffResponse(updatedStaff);
    }

    public void deleteStaff(Long staffId) {

        if (!staffRepository.existsById(staffId)) {
            throw new RuntimeException(
                    "Staff not found with id: " + staffId
            );
        }

        staffRepository.deleteById(staffId);
    }
}