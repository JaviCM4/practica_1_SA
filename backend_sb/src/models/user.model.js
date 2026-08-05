const pool = require("../config/database");

async function findByUsername(username){

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0];
}

async function updatePassword(id,password){

    await pool.query(
        "UPDATE users SET password=? WHERE id=?",
        [password,id]
    );
}

async function findById(id){

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE id=?",
        [id]
    );
    return rows[0];
}

async function createUser(username, password) {

    const [result] = await pool.query(
        "INSERT INTO users(username, password) VALUES(?, ?)",
        [username, password]
    );
    return result.insertId;

}

module.exports={
    findByUsername,
    findById,
    updatePassword,
    createUser
}