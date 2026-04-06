    package br.com.nomadwear.exception;

    import java.time.LocalDateTime;
    import java.util.HashMap;
    import java.util.Map;
    import java.util.NoSuchElementException;

    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.MethodArgumentNotValidException;
    import org.springframework.web.bind.annotation.ControllerAdvice;
    import org.springframework.web.bind.annotation.ExceptionHandler;
    import org.springframework.web.bind.annotation.ResponseStatus;

    @ControllerAdvice
    public class GlobalExceptionHandler {

        // Trata exceções de validação
        @ExceptionHandler(MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
            Map<String, String> errors = new HashMap<>();
            ex.getBindingResult().getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );

            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    "Erro de validação",
                    errors,
                    LocalDateTime.now()
            );

            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Trata exceções de argumentos inválidos
        @ExceptionHandler(IllegalArgumentException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    ex.getMessage(),
                    null,
                    LocalDateTime.now()
            );

            return ResponseEntity.badRequest().body(errorResponse);
        }

         //Trata exceções gerais não capturada
        @ExceptionHandler(Exception.class)
        @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Erro interno do servidor: " + ex.getMessage(),
                    null,
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }

         // Trata exceções de recurso não encontrado
        @ExceptionHandler(NoSuchElementException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ResponseEntity<ErrorResponse> handleNotFoundException(NoSuchElementException ex) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.NOT_FOUND.value(),
                    ex.getMessage(),
                    null,
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
