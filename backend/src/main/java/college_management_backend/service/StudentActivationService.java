
package college_management_backend.service;

import college_management_backend.dto.ActivateStudentRequest;
import college_management_backend.dto.ActivateStudentResponse;
import college_management_backend.entity.StudentActivationToken;
import college_management_backend.entity.User;
import college_management_backend.repository.StudentActivationTokenRepository;
import college_management_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class StudentActivationService {

    private final StudentActivationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public StudentActivationService(
            StudentActivationTokenRepository tokenRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(bytes);
    }

    @Transactional
    public void createActivationToken(Long userId, String rawToken) {
        StudentActivationToken record = tokenRepository
                .findByUserId(userId)
                .orElseGet(StudentActivationToken::new);

        record.setUserId(userId);
        record.setTokenHash(hashToken(rawToken));
        record.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        record.setUsedAt(null);
        record.setCreatedAt(LocalDateTime.now());

        tokenRepository.save(record);
    }

    @Transactional
    public ActivateStudentResponse activate(ActivateStudentRequest request) {
        String hash = hashToken(request.token());

        StudentActivationToken record = tokenRepository
                .findByTokenHash(hash)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid activation link."
                ));

        if (record.getUsedAt() != null
                || !record.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This activation link has expired or has already been used."
            );
        }

        User user = userRepository.findById(record.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "The associated account no longer exists."
                ));

        if (!userRepository.hasRole(user.getUserId(), "STUDENT")
                || !userRepository.hasStudentProfile(user.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "This account is not eligible for student activation."
            );
        }

        if (!userRepository.isActiveUser(user.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "This account is not active."
            );
        }

        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        record.setUsedAt(LocalDateTime.now());
        tokenRepository.save(record);

        return new ActivateStudentResponse(
                "Your password has been set. You can now log in."
        );
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash activation token.", ex);
        }
    }
}
