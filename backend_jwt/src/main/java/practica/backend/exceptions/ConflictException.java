package practica.backend.exceptions;

/**
 * Excepción que se lanza cuando hay un conflicto con un recurso (ej: duplicado)
 */
public class ConflictException extends Exception {

    public ConflictException() {}

    public ConflictException(String message) {
        super(message);
    }
}
