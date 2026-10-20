
package college_management_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class StudentActivationEmailService {

    private final JavaMailSender mailSender;
    private final String frontendUrl;

    public StudentActivationEmailService(
            JavaMailSender mailSender,
            @Value("${app.frontend.url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
    }

    public void sendActivationEmail(String email, String rawToken) {
        String activationUrl = frontendUrl
                + "/activate-student?token=" + rawToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Activate your College Management System account");
        message.setText(
                "Your admission has been approved.\n\n"
                + "Set your student account password using this link:\n"
                + activationUrl + "\n\n"
                + "This link expires in 30 minutes and can be used only once.\n"
                + "If you did not expect this email, contact the college administration."
        );

        mailSender.send(message);
    }
}
