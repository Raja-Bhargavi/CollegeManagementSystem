
package college_management_backend.service;

import college_management_backend.event.StudentAdmissionApprovedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Component
public class StudentAdmissionApprovedListener {

    private static final Logger log =
            LoggerFactory.getLogger(StudentAdmissionApprovedListener.class);

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
    log.info("Activation listener triggered for userId={}", event.userId());

    log.info(
            "Transaction active at listener start: {}",
            TransactionSynchronizationManager.isActualTransactionActive()
    );

    try {
        String rawToken = activationService.generateRawToken();

        log.info(
                "Transaction active before token creation: {}",
                TransactionSynchronizationManager.isActualTransactionActive()
        );

        activationService.createActivationToken(event.userId(), rawToken);

        log.info("Activation token saved for userId={}", event.userId());

        emailService.sendActivationEmail(event.email(), rawToken);

        log.info("Activation email sent for userId={}", event.userId());

    } catch (Exception ex) {
        log.error(
                "Activation processing failed for userId={}",
                event.userId(),
                ex
        );
        throw ex;
    }
}

}
