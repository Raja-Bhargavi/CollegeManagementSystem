package college_management_backend.service;

import college_management_backend.dto.ManagementProfileUpdateRequest;
import college_management_backend.dto.ManagementResponse;
import college_management_backend.entity.Management;
import college_management_backend.repository.ManagementRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManagementService {

    private final ManagementRepository managementRepository;

    public ManagementService(
            ManagementRepository managementRepository) {

        this.managementRepository = managementRepository;
    }

    // =========================================================
    // GET MANAGEMENT PROFILE
    // =========================================================

    public ManagementResponse getMyProfile(
            Long userId) {

        Management management =
                managementRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Management profile not found for user ID: "
                                                + userId
                                )
                        );

        return new ManagementResponse(management);
    }

    // =========================================================
    // UPDATE MANAGEMENT PROFILE
    // =========================================================

    @Transactional
    public ManagementResponse updateMyProfile(
            Long userId,
            ManagementProfileUpdateRequest request) {

        Management management =
                managementRepository
                        .findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Management profile not found for user ID: "
                                                + userId
                                )
                        );

        management.setFirstName(
                request.getFirstName()
        );

        management.setLastName(
                request.getLastName()
        );

        management.setDesignation(
                request.getDesignation()
        );

        Management updatedManagement =
                managementRepository.save(management);

        return new ManagementResponse(
                updatedManagement
        );
    }
}