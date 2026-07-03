import pool from "../config/database.js";
import { markAsNotified } from "../DAO/reminder.dao.js";

/* ==========================================
   PROCESAR RECORDATORIOS
========================================== */

export const processReminders = async () => {

    const now = new Date();

    const [rows] = await pool.query(
        `SELECT * FROM recordatorios 
         WHERE notificado = 0 
         AND fecha <= ?`,
        [now]
    );

    for (const r of rows) {

        console.log("🔔 Reminder:", r.titulo);

        await markAsNotified(r.recordatorio_id);
    }

    return rows.length;
};