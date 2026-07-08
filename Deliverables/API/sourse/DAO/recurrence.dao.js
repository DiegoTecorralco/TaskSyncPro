import pool from "../config/database.js";

/* ==========================================
   OBTENER TODAS LAS RECURRENCIAS
========================================== */
export const getAllRecurrences = async () => {
    const [rows] = await pool.query(
        `SELECT 
            recurrencia_id,
            recordatorio_id,
            tipo,
            intervalo
         FROM recurrencias`
    );
    return rows;
};

/* ==========================================
   OBTENER POR ID
========================================== */
export const getRecurrenceById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            recurrencia_id,
            recordatorio_id,
            tipo,
            intervalo
         FROM recurrencias
         WHERE recurrencia_id = ?`,
        [id]
    );
    return rows[0];
};

/* ==========================================
   OBTENER POR RECORDATORIO
========================================== */
export const getRecurrenceByReminder = async (reminderId) => {
    const [rows] = await pool.query(
        `SELECT 
            recurrencia_id,
            recordatorio_id,
            tipo,
            intervalo
         FROM recurrencias
         WHERE recordatorio_id = ?`,
        [reminderId]
    );
    return rows;
};

/* ==========================================
   CREAR RECURRENCIA
========================================== */
export const createRecurrence = async (recurrence) => {
    const {
        recordatorio_id,
        tipo,
        intervalo
    } = recurrence;

    const [result] = await pool.query(
        `INSERT INTO recurrencias 
        (recordatorio_id, tipo, intervalo)
        VALUES (?, ?, ?)`,
        [recordatorio_id, tipo, intervalo]
    );
    return result.insertId;
};

/* ==========================================
   ACTUALIZAR RECURRENCIA
========================================== */
export const updateRecurrence = async (id, recurrence) => {
    const {
        tipo,
        intervalo
    } = recurrence;

    const [result] = await pool.query(
        `UPDATE recurrencias 
         SET tipo = ?,
             intervalo = ?
         WHERE recurrencia_id = ?`,
        [tipo, intervalo, id]
    );
    return result.affectedRows;
};

/* ==========================================
   ELIMINAR RECURRENCIA
========================================== */
export const deleteRecurrence = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM recurrencias WHERE recurrencia_id = ?`,
        [id]
    );
    return result.affectedRows;
};