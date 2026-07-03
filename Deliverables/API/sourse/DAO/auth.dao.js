import pool from "../config/database.js";

/* ==========================================
   BUSCAR USUARIO POR CORREO
========================================== */

export const findUserByEmail = async (correo) => {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios WHERE correo = ?`,
        [correo]
    );

    return rows[0];
};

/* ==========================================
   CREAR USUARIO
========================================== */

export const createAuthUser = async (user) => {
    const {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        password
    } = user;

    const [result] = await pool.query(
        `INSERT INTO usuarios 
        (nombre, apellido_paterno, apellido_materno, correo, password)
        VALUES (?, ?, ?, ?, ?)`,
        [nombre, apellido_paterno, apellido_materno, correo, password]
    );

    return result.insertId;
};