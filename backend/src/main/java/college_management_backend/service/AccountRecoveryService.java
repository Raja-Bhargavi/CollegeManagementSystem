
package college_management_backend.service;

import college_management_backend.dto.EmailRequest;
import college_management_backend.dto.ResetPasswordRequest;
import college_management_backend.entity.PasswordResetToken;
import college_management_backend.entity.User;
import college_management_backend.repository.PasswordResetTokenRepository;
import college_management_backend.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class AccountRecoveryService {

    private static final String GENERIC_RESPONSE =
            "If an account matches that email address, instructions will be sent shortly.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.mail.from}")
    private String mailFrom;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.password-reset-expiry-minutes:15}")
    private long expiryMinutes;

    public AccountRecoveryService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public String forgotUsername(EmailRequest request) {
        String email = normalizeEmail(request.getEmail());

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if ("ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
                sendUsernameEmail(user);
            }
        }

        return GENERIC_RESPONSE;
    }

    @Transactional
    public String forgotPassword(EmailRequest request) {
        String email = normalizeEmail(request.getEmail());

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if ("ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
                List<PasswordResetToken> previousTokens =
                        tokenRepository.findByUserIdAndUsedFalse(
                                user.getUserId()
                        );

                previousTokens.forEach(token -> token.setUsed(true));
                tokenRepository.saveAll(previousTokens);

                String rawToken = generateToken();

                PasswordResetToken resetToken = new PasswordResetToken();
                resetToken.setUserId(user.getUserId());
                resetToken.setTokenHash(hashToken(rawToken));
                resetToken.setCreatedAt(LocalDateTime.now());
                resetToken.setExpiresAt(
                        LocalDateTime.now().plusMinutes(expiryMinutes)
                );
                resetToken.setUsed(false);

                tokenRepository.save(resetToken);

                String resetLink = frontendUrl
                        + "/reset-password?token="
                        + rawToken;

                sendPasswordResetEmail(user, resetLink);
            }
        }

        return GENERIC_RESPONSE;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String tokenHash = hashToken(request.getToken());

        PasswordResetToken resetToken = tokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() -> invalidToken());

        LocalDateTime now = LocalDateTime.now();

        if (resetToken.isUsed() || !resetToken.getExpiresAt().isAfter(now)) {
            throw invalidToken();
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> invalidToken());

        if (!"ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
            throw invalidToken();
        }

        user.setPasswordHash(
                passwordEncoder.encode(request.getNewPassword())
        );
        user.setUpdatedAt(now);

        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Invalidate any other outstanding reset links for this user.
        List<PasswordResetToken> otherTokens =
                tokenRepository.findByUserIdAndUsedFalse(user.getUserId());

        otherTokens.forEach(token -> token.setUsed(true));
        tokenRepository.saveAll(otherTokens);
    }

    private void sendUsernameEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("College Management System - Username Recovery");
        message.setText(
                "Hello,\n\n"
                + "Your College Management System username is: "
                + user.getUsername()
                + "\n\n"
                + "If you did not request this email, you can ignore it."
        );

        mailSender.send(message);
    }

    private void sendPasswordResetEmail(User user, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("College Management System - Reset Password");
        message.setText(
                "Hello,\n\n"
                + "A password reset was requested for your account.\n\n"
                + "Use this link to choose a new password:\n"
                + resetLink
                + "\n\n"
                + "This link expires in "
                + expiryMinutes
                + " minutes and can be used only once.\n\n"
                + "If you did not request this, ignore this email."
        );

        mailSender.send(message);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            StringBuilder hex = new StringBuilder();

            for (byte value : hash) {
                hex.append(String.format("%02x", value));
            }

            return hex.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is not available", exception
            );
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private ResponseStatusException invalidToken() {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "This password reset link is invalid or has expired."
        );
    }
}
