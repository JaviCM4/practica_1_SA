const authController = require("../src/controllers/auth.controller");
const authService = require("../src/services/auth.service");

jest.mock("../src/services/auth.service");

describe("AuthController", () => {

    let req, res;

    beforeEach(() => {
        req = { body: {}, session: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            clearCookie: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("login", () => {

        test("credenciales válidas retorna 200 con usuario y lo guarda en sesión", async () => {
            // Arrange
            req.body = { username: "testuser", password: "password123" };
            const mockUser = { id: 1, username: "testuser" };
            authService.login.mockResolvedValue(mockUser);

            // Act
            await authController.login(req, res);

            // Assert
            expect(req.session.user).toEqual(mockUser);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Inicio de sesión exitoso.",
                user: mockUser
            });
        });

        test("credenciales inválidas retorna 401 con mensaje de error", async () => {
            // Arrange
            req.body = { username: "testuser", password: "wrongpass" };
            authService.login.mockRejectedValue(new Error("Usuario o contraseña incorrectos."));

            // Act
            await authController.login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: "Usuario o contraseña incorrectos."
            });
        });
    });

    describe("logout", () => {

        test("cierra la sesión y limpia la cookie correctamente", () => {
            // Arrange
            req.session.destroy = jest.fn((cb) => cb(null));

            // Act
            authController.logout(req, res);

            // Assert
            expect(res.clearCookie).toHaveBeenCalledWith("connect.sid");
            expect(res.json).toHaveBeenCalledWith({
                message: "Sesión cerrada correctamente."
            });
        });

        test("error al destruir la sesión retorna 500", () => {
            // Arrange
            req.session.destroy = jest.fn((cb) => cb(new Error("Session error")));

            // Act
            authController.logout(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "No se pudo cerrar la sesión."
            });
        });
    });

    describe("profile", () => {

        test("retorna el usuario almacenado en sesión", () => {
            // Arrange
            req.session.user = { id: 1, username: "testuser" };

            // Act
            authController.profile(req, res);

            // Assert
            expect(res.json).toHaveBeenCalledWith({ id: 1, username: "testuser" });
        });
    });

    describe("changePassword", () => {

        test("contraseña actualizada retorna mensaje de éxito", async () => {
            // Arrange
            req.session.user = { id: 1 };
            req.body = { currentPassword: "oldpass", newPassword: "newpass" };
            authService.changePassword.mockResolvedValue();

            // Act
            await authController.changePassword(req, res);

            // Assert
            expect(authService.changePassword).toHaveBeenCalledWith(1, "oldpass", "newpass");
            expect(res.json).toHaveBeenCalledWith({
                message: "Contraseña actualizada correctamente."
            });
        });

        test("contraseña incorrecta retorna 400 con mensaje de error", async () => {
            // Arrange
            req.session.user = { id: 1 };
            req.body = { currentPassword: "wrongpass", newPassword: "newpass" };
            authService.changePassword.mockRejectedValue(
                new Error("La contraseña actual es incorrecta.")
            );

            // Act
            await authController.changePassword(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "La contraseña actual es incorrecta."
            });
        });
    });

    describe("register", () => {

        test("registro exitoso retorna 201 con usuario creado", async () => {
            // Arrange
            req.body = { username: "newuser", password: "password123" };
            const mockUser = { id: 5, username: "newuser" };
            authService.register.mockResolvedValue(mockUser);

            // Act
            await authController.register(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Usuario creado correctamente.",
                user: mockUser
            });
        });

        test("usuario ya existente retorna 400 con mensaje de error", async () => {
            // Arrange
            req.body = { username: "testuser", password: "password123" };
            authService.register.mockRejectedValue(new Error("El usuario ya existe."));

            // Act
            await authController.register(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "El usuario ya existe."
            });
        });
    });
});
