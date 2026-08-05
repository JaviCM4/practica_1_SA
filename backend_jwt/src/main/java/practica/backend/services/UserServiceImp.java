package practica.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import practica.backend.dtos.*;
import practica.backend.exceptions.ConflictException;
import practica.backend.exceptions.ResourceNotFoundException;
import practica.backend.exceptions.ValidationException;
import practica.backend.models.User;
import practica.backend.repositories.UserRepository;
import practica.backend.security.JwtService;

@Service
@Transactional(rollbackFor = Exception.class)
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public RegisterResponse login(LoginRequest dto) throws ValidationException {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ValidationException("Username o Password incorrecto"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ValidationException("Username o Password incorrecto");
        }

        String token = jwtService.generateToken(user);
        return new RegisterResponse(user.getId(), user.getUsername(), token);
    }

    @Override
    public void changePassword(PasswordRequest dto)
            throws ResourceNotFoundException, ValidationException {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            userRepository.save(user);
        } else {
            throw new ValidationException("Contraseña incorrecta");
        }
    }

    @Override
    public RegisterUserResponse register(RegisterRequest dto) throws ConflictException {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new ConflictException("Username ya registrado");
        }

        User newUser = dto.createEntity();

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User savedUser = userRepository.save(newUser);
        return new RegisterUserResponse(savedUser.getId(), savedUser.getUsername());
    }

    @Override
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}