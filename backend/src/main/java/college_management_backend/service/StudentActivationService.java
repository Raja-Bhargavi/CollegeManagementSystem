
package college_management_backend.service;

import college_management_backend.dto.ActivateStudentRequest;
import college_management_backend.dto.ActivateStudentResponse;
import college_management_backend.entity.StudentActivationToken;
import college_management_backend.entity.User;
import college_management_backend.repository.StudentActivationTokenRepository;
import college_management_backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class StudentActivationService {

    private static final Logger log =
            LoggerFactory.getLogger(StudentActivationService.class);

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

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

 @Transactional(propagation = Propagation.REQUIRES_NEW)
public void createActivationToken(Long userId, String rawToken) {

        log.info(
        "Transaction active inside createActivationToken: {}",
        TransactionSynchronizationManager.isActualTransactionActive()
);
    StudentActivationToken record = tokenRepository
            .findByUserId(userId)
            .orElseGet(StudentActivationToken::new);

    LocalDateTime now = LocalDateTime.now();

    record.setUserId(userId);
    record.setTokenHash(hashToken(rawToken));
    record.setExpiresAt(now.plusMinutes(30));
    record.setUsedAt(null);
    record.setCreatedAt(now);

    StudentActivationToken saved =
            tokenRepository.saveAndFlush(record);

    log.info(
            "Activation token flushed: tokenId={}, userId={}",
            saved.getActivationTokenId(),
            saved.getUserId()
    );

    long count = tokenRepository.count();

    log.info(
            "Activation token count inside transaction: {}",
            count
    );
}

    @Transactional
    public ActivateStudentResponse activate(
            ActivateStudentRequest request) {

        if (request.token() == null || request.token().isBlank()) {
            log.warn("Activation request received without a token");

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Activation token is required."
            );
        }

        log.info("Processing student activation request");

        String hash = hashToken(request.token());

        log.info("Activation request token length: {}", request.token().length());
        log.info("Computed activation hash length: {}", hash.length());
        StudentActivationToken record = tokenRepository
                .findByTokenHash(hash)
                .orElseThrow(() -> {
                    log.warn(
                            "Activation token was not found in the database"
                    );

                    return new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid activation link."
                    );
                });

        log.info(
                "Activation token found for userId={}",
                record.getUserId()
        );

        LocalDateTime now = LocalDateTime.now();

        if (record.getUsedAt() != null
                || !record.getExpiresAt().isAfter(now)) {
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

        if (userRepository.hasRole(user.getUserId(), "STUDENT") <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "This account does not have the STUDENT role."
                );
                }

        if (userRepository.isActiveUser(user.getUserId()) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "This account is not active."
            );
        }

        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setUpdatedAt(now);
        userRepository.save(user);

        record.setUsedAt(now);
        tokenRepository.save(record);

        log.info(
                "Student account activated successfully for userId={}",
                user.getUserId()
        );

        return new ActivateStudentResponse(
                "Your password has been set. You can now log in."
        );
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Unable to hash activation token.", ex
            );
        }
    }
}
