import pool from "../config/database.js";

/* ==========================================
   OBTENER TODOS LOS RECORDATORIOS
========================================== */
export const getAllReminders = async () => {
    const [rows] = await pool.query(
        `SELECT 
            recordatorio_id,
            usuario_id,
            categoria_id,
            titulo,
            descripcion,
            fecha,
            notificado
         FROM recordatorios`
    );
    return rows;
};

/* ==========================================
   OBTENER RECORDATORIO POR ID
========================================== */
export const getReminderById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            recordatorio_id,
            usuario_id,
            categoria_id,
            titulo,
            descripcion,
            fecha,
            notificado
         FROM recordatorios
         WHERE recordatorio_id = ?`,
        [id]
    );
    return rows[0];
};

/* ==========================================
   OBTENER RECORDATORIOS POR USUARIO
========================================== */
export const getRemindersByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT 
            recordatorio_id,
            usuario_id,
            categoria_id,
            titulo,
            descripcion,
            fecha,
            notificado
         FROM recordatorios
         WHERE usuario_id = ?
         ORDER BY fecha ASC`,
        [userId]
    );
    return rows;
};

/* ==========================================
   CREAR RECORDATORIO
========================================== */
export const createReminder = async (reminder) => {
    const {
        usuario_id,
        categoria_id,
        titulo,
        descripcion,
        fecha
    } = reminder;

    const [result] = await pool.query(
        `INSERT INTO recordatorios 
        (usuario_id, categoria_id, titulo, descripcion, fecha, notificado)
        VALUES (?, ?, ?, ?, ?, 0)`,
        [usuario_id, categoria_id, titulo, descripcion, fecha]
    );

    return result.insertId;
};

/* ==========================================
   ACTUALIZAR RECORDATORIO
========================================== */
export const updateReminder = async (id, reminder) => {
    const {
        categoria_id,
        titulo,
        descripcion,
        fecha,
        notificado
    } = reminder;

    const [result] = await pool.query(
        `UPDATE recordatorios 
         SET categoria_id = ?,
             titulo = ?,
             descripcion = ?,
             fecha = ?,
             notificado = ?
         WHERE recordatorio_id = ?`,
        [categoria_id, titulo, descripcion, fecha, notificado, id]
    );

    return result.affectedRows;
};

/* ==========================================
   ELIMINAR RECORDATORIO
========================================== */
export const deleteReminder = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM recordatorios WHERE recordatorio_id = ?`,
        [id]
    );
    return result.affectedRows;
};

/* ==========================================
   MARCAR COMO NOTIFICADO
========================================== */
export const markAsNotified = async (id) => {
    const [result] = await pool.query(
        `UPDATE recordatorios 
         SET notificado = 1
         WHERE recordatorio_id = ?`,
        [id]
    );
    return result.affectedRows;
};