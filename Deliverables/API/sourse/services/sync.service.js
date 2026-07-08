import pool from "../config/database.js";

/* ==========================================
   SINCRONIZACIÓN MULTI-DISPOSITIVO
========================================== */
export const syncUserData = async (userId) => {
    const [tasks] = await pool.query(
        `SELECT * FROM recordatorios WHERE usuario_id = ?`,
        [userId]
    );

    const [categories] = await pool.query(
        `SELECT * FROM categorias`
    );

    return {
        tasks,
        categories,
        timestamp: new Date()
    };
};