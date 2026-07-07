import { Router } from "express";
import {
    getReminders,
    getReminder,
    getRemindersUser,
    createNewReminder,
    updateReminderById,
    deleteReminderById,
    markReminderAsNotified
} from "../controllers/reminder.controller.js";

// ✅ Crear el router
const router = Router();

// ✅ Definir las rutas
// Obtener todos los recordatorios
router.get("/", getReminders);

// Obtener recordatorio por ID
router.get("/:id", getReminder);

// Obtener recordatorios por usuario
router.get("/user/:userId", getRemindersUser);

// Crear recordatorio
router.post("/", createNewReminder);

// Actualizar recordatorio
router.put("/:id", updateReminderById);

// Eliminar recordatorio
router.delete("/:id", deleteReminderById);

// Marcar como notificado
router.patch("/:id/notify", markReminderAsNotified);

// ✅ Exportar el router
export default router;