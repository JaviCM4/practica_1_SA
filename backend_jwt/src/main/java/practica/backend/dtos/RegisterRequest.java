package practica.backend.dtos;

import lombok.Value;
import practica.backend.models.User;

@Value
public class RegisterRequest {
    private String username;
    private String password;

    public User createEntity() {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }
}
