package practica.backend.exceptions;

/**
 * Excepción que se lanza cuando un recurso no es encontrado
 */
public class ResourceNotFoundException extends Exception {

    public ResourceNotFoundException() {}

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
