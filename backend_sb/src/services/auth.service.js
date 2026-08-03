const bcrypt = require("bcrypt");

const userModel = require("../models/user.model");

async function login(username, password) {

    const user = await userModel.findByUsername(username);

    if (!user) {
        throw new Error("Usuario o contraseña incorrectos.");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw new Error("Usuario o contraseña incorrectos.");
    }

    return {
        id: user.id,
        username: user.username
    };

}

async function changePassword(userId, currentPassword, newPassword) {

    const user = await userModel.findById(userId);

    if (!user) {
        throw new Error("Usuario no encontrado.");
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
        throw new Error("La contraseña actual es incorrecta.");
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await userModel.updatePassword(user.id, hash);

}

async function register(username, password) {

    const existingUser = await userModel.findByUsername(username);

    if (existingUser) {
        throw new Error("El usuario ya existe.");
    }

    const hash = await bcrypt.hash(password, 10);

    const id = await userModel.createUser(username, hash);

    return {
        id,
        username
    };

}

module.exports = {
    login,
    changePassword,
    register
};