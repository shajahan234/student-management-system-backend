package office.com.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Invalid or missing request body (e.g. empty JSON, wrong Content-Type).
     * Returns 400 so the frontend can show a clear message instead of 500.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = ex.getMostSpecificCause() != null
                ? ex.getMostSpecificCause().getMessage()
                : "Invalid or missing request body";
        if (message == null || message.isEmpty()) {
            message = "Request body must be valid JSON";
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", message));
    }

    /**
     * Catch any other uncaught exception to return JSON and avoid HTML 500 page.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        ex.printStackTrace();
        String message = ex.getMessage() != null ? ex.getMessage() : "Internal server error";
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", message));
    }

    /**
     * Catch errors (e.g. NoSuchMethodError, OutOfMemoryError) so we still return JSON.
     */
    @ExceptionHandler(Throwable.class)
    public ResponseEntity<Map<String, String>> handleThrowable(Throwable ex) {
        ex.printStackTrace();
        String message = ex.getMessage() != null ? ex.getMessage() : "Internal server error";
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", message));
    }
}
