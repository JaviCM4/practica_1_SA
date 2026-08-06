package practica.backend.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import practica.backend.dtos.LoginRequest;
import practica.backend.dtos.PasswordRequest;
import practica.backend.dtos.RegisterRequest;
import practica.backend.dtos.RegisterResponse;
import practica.backend.dtos.RegisterUserResponse;
import practica.backend.exceptions.ConflictException;
import practica.backend.exceptions.ResourceNotFoundException;
import practica.backend.exceptions.ValidationException;
import practica.backend.models.User;
import practica.backend.repositories.UserRepository;
import practica.backend.security.JwtService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImpTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserServiceImp userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User(1, "testuser", "hashedPassword");
    }

    @Test
    void login_credencialesValidas_retornaRegistroConToken() throws ValidationException {
        // Arrange
        LoginRequest dto = new LoginRequest("testuser", "password123");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        // Act
        RegisterResponse response = userService.login(dto);

        // Assert
        assertThat(response.getId()).isEqualTo(1);
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getToken()).isEqualTo("jwt-token");
    }

    @Test
    void login_usernameNoExiste_lanzaValidationException() {
        // Arrange
        LoginRequest dto = new LoginRequest("noexiste", "password123");
        when(userRepository.findByUsername("noexiste")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.login(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Username o Password incorrecto");
    }

    @Test
    void login_passwordIncorrecta_lanzaValidationException() {
        // Arrange
        LoginRequest dto = new LoginRequest("testuser", "wrongpass");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> userService.login(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Username o Password incorrecto");
    }

    @Test
    void register_nuevoUsuario_retornaRegisterUserResponse() throws ConflictException {
        // Arrange
        RegisterRequest dto = new RegisterRequest("newuser", "pass123");
        User savedUser = new User(2, "newuser", "hashedpass");
        when(userRepository.findByUsername("newuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        RegisterUserResponse response = userService.register(dto);

        // Assert
        assertThat(response.getIdUser()).isEqualTo(2);
        assertThat(response.getUsername()).isEqualTo("newuser");
    }

    @Test
    void register_usernameYaRegistrado_lanzaConflictException() {
        // Arrange
        RegisterRequest dto = new RegisterRequest("testuser", "pass123");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> userService.register(dto))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Username ya registrado");
    }

    @Test
    void changePassword_datosCorrectos_guardaNuevaContrasena()
            throws ResourceNotFoundException, ValidationException {
        // Arrange
        PasswordRequest dto = new PasswordRequest(1, "password123", "newPass456");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPass456")).thenReturn("newHashed");

        // Act
        userService.changePassword(dto);

        // Assert
        verify(userRepository).save(user);
        assertThat(user.getPassword()).isEqualTo("newHashed");
    }

    @Test
    void changePassword_usuarioNoEncontrado_lanzaResourceNotFoundException() {
        // Arrange
        PasswordRequest dto = new PasswordRequest(99, "pass", "newpass");
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.changePassword(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuario no encontrado");
    }

    @Test
    void changePassword_contrasenaActualIncorrecta_lanzaValidationException() {
        // Arrange
        PasswordRequest dto = new PasswordRequest(1, "wrongpass", "newPass456");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashedPassword")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> userService.changePassword(dto))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Contraseña incorrecta");
    }

    @Test
    void logout_limpiaSecurityContext() {
        // Arrange - ninguna configuración especial necesaria

        // Act
        userService.logout();

        // Assert
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}
