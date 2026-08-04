package practica.backend.dtos;

import lombok.Value;

@Value
public class RegisterUserResponse {
    private Integer idUser;
    private String username;
}
