package college_management_backend.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;


import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(StudentNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleStudentNotFound(
            StudentNotFoundException exception) {

        return Map.of(
                "error", "Student Not Found",
                "message", exception.getMessage()
        );
    }


    @ExceptionHandler(DuplicateStudentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleDuplicateStudent(
            DuplicateStudentException exception) {

        return Map.of(
                "error", "Duplicate Student",
                "message", exception.getMessage()
        );
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidationErrors(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> response = new HashMap<>();

        response.put("error", "Validation Failed");
        response.put("fields", errors);

        return response;
    }

        @ExceptionHandler(RegistrationNotFoundException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public Map<String, String> handleRegistrationNotFound(
                RegistrationNotFoundException exception) {

        return Map.of(
                "error", "Registration Not Found",
                "message", exception.getMessage()
        );
        }

        @ExceptionHandler(DuplicateRegistrationException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public Map<String, String> handleDuplicateRegistration(
                DuplicateRegistrationException exception) {

        return Map.of(
                "error", "Duplicate Registration",
                "message", exception.getMessage()
        );
        }

        @ExceptionHandler(InvalidMarksException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public Map<String, String> handleInvalidMarks(
                InvalidMarksException exception) {

                return Map.of(
                        "error", "Invalid Marks",
                        "message", exception.getMessage()
                );
        }

        @ExceptionHandler(DuplicateMarkException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public Map<String, String> handleDuplicateMark(
                DuplicateMarkException exception) {

        return Map.of(
                "error", "Duplicate Mark",
                "message", exception.getMessage()
        );
        }
}