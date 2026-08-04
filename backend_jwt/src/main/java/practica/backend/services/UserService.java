package practica.backend.services;

import practica.backend.dtos.*;
import practica.backend.exceptions.ConflictException;
import practica.backend.exceptions.ResourceNotFoundException;
import practica.backend.exceptions.ValidationException;

public interface UserService {

    RegisterResponse login(LoginRequest dto) throws ValidationException;

    void changePassword(PasswordRequest dto) throws ResourceNotFoundException, ValidationException;

    RegisterUserResponse register(RegisterRequest dto) throws ConflictException;

    void logout();
}
