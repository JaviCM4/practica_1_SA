package practica.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import practica.backend.dtos.LoginRequest;
import practica.backend.dtos.PasswordRequest;
import practica.backend.dtos.RegisterRequest;
import practica.backend.dtos.RegisterResponse;
import practica.backend.dtos.RegisterUserResponse;
import practica.backend.exceptions.ConflictException;
import practica.backend.exceptions.ResourceNotFoundException;
import practica.backend.exceptions.ValidationException;
import practica.backend.exceptionhandler.ControllerExceptionHandler;
import practica.backend.services.UserService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(userController)
                .setControllerAdvice(new ControllerExceptionHandler())
                .build();
    }

    @Test
    void register_datosValidos_retorna201ConUsuario() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest("testuser", "password123");
        RegisterUserResponse response = new RegisterUserResponse(1, "testuser");
        when(userService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idUser").value(1))
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void register_usernameExistente_retorna409() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest("testuser", "password123");
        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(new ConflictException("Username ya registrado"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void login_credencialesValidas_retorna200ConToken() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", "password123");
        RegisterResponse response = new RegisterResponse(1, "testuser", "jwt-token");
        when(userService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void login_credencialesInvalidas_retorna400() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");
        when(userService.login(any(LoginRequest.class)))
                .thenThrow(new ValidationException("Username o Password incorrecto"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void changePassword_datosCorrectos_retorna204() throws Exception {
        // Arrange
        PasswordRequest request = new PasswordRequest(1, "currentPass", "newPass");
        doNothing().when(userService).changePassword(any(PasswordRequest.class));

        // Act & Assert
        mockMvc.perform(patch("/api/auth/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNoContent());
    }

    @Test
    void changePassword_usuarioNoEncontrado_retorna404() throws Exception {
        // Arrange
        PasswordRequest request = new PasswordRequest(99, "currentPass", "newPass");
        doThrow(new ResourceNotFoundException("Usuario no encontrado"))
                .when(userService).changePassword(any(PasswordRequest.class));

        // Act & Assert
        mockMvc.perform(patch("/api/auth/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void changePassword_contrasenaIncorrecta_retorna400() throws Exception {
        // Arrange
        PasswordRequest request = new PasswordRequest(1, "wrongPass", "newPass");
        doThrow(new ValidationException("Contraseña incorrecta"))
                .when(userService).changePassword(any(PasswordRequest.class));

        // Act & Assert
        mockMvc.perform(patch("/api/auth/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void logout_retorna204() throws Exception {
        // Arrange
        doNothing().when(userService).logout();

        // Act & Assert
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isNoContent());
    }
}
