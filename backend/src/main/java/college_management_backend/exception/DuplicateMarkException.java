package college_management_backend.exception;

public class DuplicateMarkException extends RuntimeException {

    public DuplicateMarkException(String message) {
        super(message);
    }
}