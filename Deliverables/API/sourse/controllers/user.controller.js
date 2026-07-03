import pool from "../config/database.js";

/* ==========================================
   OBTENER TODOS LOS USUARIOS
========================================== */
export const getAllUsers = async () => {
    const [rows] = await pool.query(
        `SELECT 
            usuario_id,
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            fecha_registro,
            fecha_actualizacion
         FROM usuarios`
    );

    return rows;
};

/* ==========================================
   OBTENER USUARIO POR ID
========================================== */
export const getUserById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            usuario_id,
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            fecha_registro,
            fecha_actualizacion
         FROM usuarios
         WHERE usuario_id = ?`,
        [id]
    );

    return rows[0];
};

/* ==========================================
   OBTENER USUARIO POR CORREO
========================================== */
export const getUserByEmail = async (correo) => {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios WHERE correo = ?`,
        [correo]
    );

    return rows[0];
};

/* ==========================================
   CREAR USUARIO
========================================== */
export const createUser = async (user) => {
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

/* ==========================================
   ACTUALIZAR USUARIO
========================================== */
export const updateUser = async (id, user) => {
    const {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo
    } = user;

    const [result] = await pool.query(
        `UPDATE usuarios 
         SET nombre = ?, 
             apellido_paterno = ?, 
             apellido_materno = ?, 
             correo = ?
         WHERE usuario_id = ?`,
        [nombre, apellido_paterno, apellido_materno, correo, id]
    );

    return result.affectedRows;
};

/* ==========================================
   ELIMINAR USUARIO
========================================== */
export const deleteUser = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM usuarios WHERE usuario_id = ?`,
        [id]
    );

    return result.affectedRows;
};