package college_management_backend.exception;

public class InvalidMarksException extends RuntimeException {

    public InvalidMarksException(String message) {
        super(message);
    }
}