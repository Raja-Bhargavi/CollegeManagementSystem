
package college_management_backend.service;

import college_management_backend.event.StudentAdmissionApprovedEvent;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class StudentAdmissionApprovedListener {

    private final StudentActivationService activationService;
    private final StudentActivationEmailService emailService;

    public StudentAdmissionApprovedListener(
            StudentActivationService activationService,
            StudentActivationEmailService emailService) {
        this.activationService = activationService;
        this.emailService = emailService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAdmissionApproved(StudentAdmissionApprovedEvent event) {
        String rawToken = activationService.generateRawToken();

        activationService.createActivationToken(
                event.userId(),
                rawToken
        );

        emailService.sendActivationEmail(
                event.email(),
                rawToken
        );
    }
}
