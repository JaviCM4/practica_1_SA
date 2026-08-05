package practica.backend.dtos;

import lombok.Value;

@Value
public class PasswordRequest {
    private int userId;
    private String currentPassword;
    private String newPassword;
}
