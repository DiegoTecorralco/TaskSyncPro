import cron from "node-cron";
import pool from "../config/database.js";
import { markAsNotified } from "../DAO/reminder.dao.js";
import { emitReminderAlert } from "../config/socket.js";

export const startReminderCron = () => {
    // Se ejecuta cada minuto
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();

            // Buscar recordatorios pendientes
            const [reminders] = await pool.query(
                `SELECT 
                    recordatorio_id,
                    usuario_id,
                    titulo,
                    descripcion,
                    fecha,
                    notificado
                 FROM recordatorios
                 WHERE notificado = 0
                 AND fecha <= ?`,
                [now]
            );

            if (reminders.length === 0) {
                return;
            }

            console.log(`Recordatorios encontrados: ${reminders.length}`);

            for (const reminder of reminders) {
                // Notificar en tiempo real vía Socket.io
                const sent = emitReminderAlert(reminder);

                if (sent) {
                    console.log(`Notificación Socket.io enviada a usuario ${reminder.usuario_id}`);
                } else {
                    console.log(`Usuario ${reminder.usuario_id} no está conectado`);
                }

                // Marcar como notificado
                await markAsNotified(reminder.recordatorio_id);
            }
        } catch (error) {
            console.error("❌ Error en cron de recordatorios:", error.message);
        }
    });

    console.log("⏰ Cron de recordatorios con Socket.io iniciado correctamente");
};