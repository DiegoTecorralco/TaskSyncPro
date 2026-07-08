import pool from "../config/database.js";

/* ==========================================
   OBTENER TAREAS PENDIENTES
========================================== */
export const getPendingTasks = async (userId) => {
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
         AND notificado = 0
         ORDER BY fecha ASC`,
        [userId]
    );

    return rows;
};

/* ==========================================
   OBTENER TAREAS COMPLETADAS
========================================== */
export const getCompletedTasks = async (userId) => {
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
         AND notificado = 1
         ORDER BY fecha DESC`,
        [userId]
    );

    return rows;
};

/* ==========================================
   DASHBOARD DE TAREAS
========================================== */
export const countTasksByUser = async (userId) => {
    const [rows] = await pool.query(
        `SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN notificado = 0 THEN 1 ELSE 0 END) AS pendientes,
            SUM(CASE WHEN notificado = 1 THEN 1 ELSE 0 END) AS completadas
         FROM recordatorios
         WHERE usuario_id = ?`,
        [userId]
    );

    return rows[0];
};