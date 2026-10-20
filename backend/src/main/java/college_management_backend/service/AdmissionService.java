
package college_management_backend.service;

import college_management_backend.entity.Role;
import college_management_backend.entity.Student;
import college_management_backend.entity.User;
import college_management_backend.entity.UserRole;
import college_management_backend.repository.RoleRepository;
import college_management_backend.repository.StudentRepository;
import college_management_backend.repository.UserRoleRepository;
import college_management_backend.dto.AdmissionSubmissionRequest;
import college_management_backend.dto.AdmissionSubmissionResponse;
import college_management_backend.entity.AdmissionRequest;
import college_management_backend.repository.AdmissionRequestRepository;
import college_management_backend.repository.ProgramRepository;
import college_management_backend.repository.UserRepository;
import college_management_backend.event.StudentAdmissionApprovedEvent;
import org.springframework.context.ApplicationEventPublisher;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.security.crypto.password.PasswordEncoder;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Locale;

@Service
public class AdmissionService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final StudentRepository studentRepository;
    private final AdmissionRequestRepository admissionRepository;
    private final ProgramRepository programRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final ApplicationEventPublisher eventPublisher;

    public AdmissionService(
        AdmissionRequestRepository admissionRepository,
        ProgramRepository programRepository,
        UserRepository userRepository,
        RoleRepository roleRepository,
        UserRoleRepository userRoleRepository,
        StudentRepository studentRepository,
        PasswordEncoder passwordEncoder,
        ApplicationEventPublisher eventPublisher) {

    this.admissionRepository = admissionRepository;
    this.programRepository = programRepository;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.userRoleRepository = userRoleRepository;
    this.studentRepository = studentRepository;
    this.passwordEncoder = passwordEncoder;
    this.eventPublisher = eventPublisher;
}
    
     

    @Transactional
    public AdmissionSubmissionResponse submit(
            AdmissionSubmissionRequest request) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This email already belongs to an account. Contact the college administration."
            );
        }

        if (admissionRepository.existsByEmailIgnoreCaseAndStatus(
                email, "PENDING")) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A pending registration already exists for this email."
            );
        }

        if (request.dateOfBirth().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Date of birth cannot be in the future."
            );
        }

        if (!programRepository.existsById(request.programId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The selected program does not exist. Refresh the program list and try again."
            );
        }

        AdmissionRequest application = new AdmissionRequest();

        application.setApplicationNumber(
                "ADM-" + request.admissionYear() + "-"
                        + UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase()
        );

        application.setFirstName(request.firstName().trim());
        application.setLastName(request.lastName().trim());
        application.setDateOfBirth(request.dateOfBirth());
        application.setGender(request.gender());
        application.setEmail(email);
        application.setPhone(request.phone().trim());
        application.setAddress(request.address());
        application.setCity(request.city());
        application.setState(request.state());
        application.setPostalCode(request.postalCode());
        application.setProgramId(request.programId());
        application.setAdmissionYear(request.admissionYear());
        application.setPreviousQualification(
                request.previousQualification());
        application.setPreviousPercentage(
                request.previousPercentage());

        application.setStatus("PENDING");

        AdmissionRequest saved =
                admissionRepository.save(application);

        return new AdmissionSubmissionResponse(
                saved.getApplicationNumber(),
                saved.getStatus(),
                "Registration submitted successfully. Keep your application number to check its status."
        );
    }

    
        @Transactional
        public AdmissionRequest decide(
                Long applicationId,
                String decision,
                String remarks,
                String adminUsername) {

        AdmissionRequest application = admissionRepository
                .findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Admission application not found."
                ));

        if (!"PENDING".equals(application.getStatus())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This application has already been reviewed."
                );
        }

        String normalizedDecision =
                decision == null ? "" : decision.trim().toUpperCase(Locale.ROOT);

        if (!normalizedDecision.equals("APPROVE")
                && !normalizedDecision.equals("REJECT")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Decision must be APPROVE or REJECT."
                );
        }

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Admin account not found."
                ));

        if ("REJECT".equals(normalizedDecision)) {
                application.setStatus("REJECTED");
                application.setAdminRemarks(remarks);
                application.setReviewedBy(admin.getUserId());
                application.setReviewedAt(LocalDateTime.now());

                return admissionRepository.save(application);
        }

        String email = application.getEmail().trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This email already belongs to an account. Resolve the account conflict before approving."
                );
        }

        if (studentRepository.existsByRollNumber(
                generateRollNumber(application.getAdmissionYear()))) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "A generated roll number already exists. Please retry."
                );
        }

        if (userRepository.countFacultyProfilesByEmail(email) > 0
                || userRepository.countStaffProfilesByEmail(email) > 0
                || userRepository.countManagementProfilesByEmail(email) > 0  ) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This email is already associated with another profile."
                );
        }

        Role studentRole = roleRepository.findByRoleName("STUDENT")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "STUDENT role is missing from the roles table."
                ));

        LocalDateTime now = LocalDateTime.now();

        String username = generateUsername(email);

        // Generate an unknown random password. The student must use
        // the existing password-reset flow to establish their password.
        String temporaryPassword = generateTemporaryPassword();

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        user.setAccountStatus("ACTIVE");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User savedUser = userRepository.saveAndFlush(user);

        userRoleRepository.saveAndFlush(
                new UserRole(savedUser.getUserId(), studentRole.getRoleId())
        );

        Student student = new Student();
        student.setUserId(savedUser.getUserId());
        student.setRollNumber(
                generateRollNumber(application.getAdmissionYear())
        );
        student.setFirstName(application.getFirstName());
        student.setLastName(application.getLastName());
        student.setDateOfBirth(application.getDateOfBirth());
        student.setGender(application.getGender());
        student.setPhone(application.getPhone());
        student.setProgramId(application.getProgramId());
        student.setAdmissionYear(application.getAdmissionYear());
        student.setCurrentSemester(1);
        student.setStudentStatus("ACTIVE");

        studentRepository.saveAndFlush(student);

        application.setStatus("APPROVED");
        application.setAdminRemarks(remarks);
        application.setReviewedBy(admin.getUserId());
        application.setReviewedAt(LocalDateTime.now());

        AdmissionRequest savedApplication =
        admissionRepository.save(application);

        eventPublisher.publishEvent(
                new StudentAdmissionApprovedEvent(
                        savedUser.getUserId(),
                        email
                )
        );

        return savedApplication;
        }

        private String generateUsername(String email) {
        String localPart = email.substring(0, email.indexOf('@'))
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9_]", "_");

        if (localPart.isBlank()) {
                localPart = "student";
        }

        for (int attempt = 0; attempt < 10; attempt++) {
                String candidate = localPart + "_"
                        + Integer.toHexString(secureRandom.nextInt()).replace("-", "");

                if (candidate.length() > 50) {
                candidate = candidate.substring(0, 50);
                }

                if (!userRepository.existsByUsername(candidate)) {
                return candidate;
                }
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Could not generate a unique username. Please retry."
        );
        }

        private String generateRollNumber(int admissionYear) {
        for (int attempt = 0; attempt < 10; attempt++) {
                String suffix = String.format(
                        "%08d",
                        secureRandom.nextInt(100_000_000)
                );

                String candidate = "STU" + admissionYear + suffix;

                if (!studentRepository.existsByRollNumber(candidate)) {
                return candidate;
                }
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Could not generate a unique roll number. Please retry."
        );
        }

        private String generateTemporaryPassword() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return java.util.Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
        }

    
}
