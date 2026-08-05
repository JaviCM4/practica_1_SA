package practica.backend.dtos;

import lombok.Value;

@Value
public class RegisterResponse {
    private Integer id;
    private String username;
    private String token;
}
