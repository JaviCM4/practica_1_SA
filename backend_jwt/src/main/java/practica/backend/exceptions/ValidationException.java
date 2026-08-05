package practica.backend.exceptions;

/**
 * Excepción que se lanza para errores en los datos de entrada
 */
public class ValidationException extends Exception {

    public ValidationException() {}

    public ValidationException(String message) {
        super(message);
    }
}
