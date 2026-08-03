const authService = require("../services/auth.service");

async function login(req, res) {

    try {
        const { username, password } = req.body;
        const user = await authService.login(username, password);
        req.session.user = user;
        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            user
        });

    } catch (error) {

        return res.status(401).json({
            message: error.message
        });

    }

}

function logout(req, res) {

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                message: "No se pudo cerrar la sesión."
            });

        }

        res.clearCookie("connect.sid");

        return res.json({
            message: "Sesión cerrada correctamente."
        });

    });

}

function profile(req, res) {

    return res.json(req.session.user);

}

async function changePassword(req, res) {

    try {

        const { currentPassword, newPassword } = req.body;

        await authService.changePassword(
            req.session.user.id,
            currentPassword,
            newPassword
        );

        return res.json({
            message: "Contraseña actualizada correctamente."
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }

}

async function register(req, res) {

    try {
        const { username, password } = req.body;
        const user = await authService.register(username, password);

        return res.status(201).json({
            message: "Usuario creado correctamente.",
            user
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    login,
    logout,
    profile,
    changePassword,
    register
};