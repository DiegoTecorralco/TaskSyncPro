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

const router = Router();

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

export default router;