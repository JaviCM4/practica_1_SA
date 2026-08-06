const bcrypt = require("bcrypt");
const userModel = require("../src/models/user.model");
const authService = require("../src/services/auth.service");

jest.mock("bcrypt");
jest.mock("../src/models/user.model");

describe("AuthService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {

        test("credenciales válidas retorna id y username", async () => {
            // Arrange
            const mockUser = { id: 1, username: "testuser", password: "hashedpass" };
            userModel.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            // Act
            const result = await authService.login("testuser", "password123");

            // Assert
            expect(result).toEqual({ id: 1, username: "testuser" });
        });

        test("usuario no encontrado lanza error", async () => {
            // Arrange
            userModel.findByUsername.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.login("noexiste", "pass"))
                .rejects.toThrow("Usuario o contraseña incorrectos.");
        });

        test("contraseña incorrecta lanza error", async () => {
            // Arrange
            const mockUser = { id: 1, username: "testuser", password: "hashedpass" };
            userModel.findByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            // Act & Assert
            await expect(authService.login("testuser", "wrongpass"))
                .rejects.toThrow("Usuario o contraseña incorrectos.");
        });
    });

    describe("register", () => {

        test("nuevo usuario retorna id y username", async () => {
            // Arrange
            userModel.findByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedpass");
            userModel.createUser.mockResolvedValue(5);

            // Act
            const result = await authService.register("newuser", "password123");

            // Assert
            expect(result).toEqual({ id: 5, username: "newuser" });
            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        });

        test("usuario ya existente lanza error", async () => {
            // Arrange
            userModel.findByUsername.mockResolvedValue({ id: 1, username: "testuser" });

            // Act & Assert
            await expect(authService.register("testuser", "pass"))
                .rejects.toThrow("El usuario ya existe.");
        });
    });

    describe("changePassword", () => {

        test("contraseña correcta llama a updatePassword con el hash nuevo", async () => {
            // Arrange
            const mockUser = { id: 1, username: "testuser", password: "hashedpass" };
            userModel.findById.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue("newhashedpass");
            userModel.updatePassword.mockResolvedValue();

            // Act
            await authService.changePassword(1, "currentpass", "newpass");

            // Assert
            expect(userModel.updatePassword).toHaveBeenCalledWith(1, "newhashedpass");
        });

        test("usuario no encontrado lanza error", async () => {
            // Arrange
            userModel.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(authService.changePassword(99, "pass", "newpass"))
                .rejects.toThrow("Usuario no encontrado.");
        });

        test("contraseña actual incorrecta lanza error", async () => {
            // Arrange
            const mockUser = { id: 1, username: "testuser", password: "hashedpass" };
            userModel.findById.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            // Act & Assert
            await expect(authService.changePassword(1, "wrongpass", "newpass"))
                .rejects.toThrow("La contraseña actual es incorrecta.");
        });
    });
});
