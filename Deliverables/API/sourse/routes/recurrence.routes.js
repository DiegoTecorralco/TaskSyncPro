import { Router } from "express";

import {
    getRecurrences,
    getRecurrence,
    getRecurrenceByReminderId,
    createNewRecurrence,
    updateRecurrenceById,
    deleteRecurrenceById
} from "../controllers/recurrence.controller.js";

const router = Router();

/* ==========================================
   RUTAS DE RECURRENCIAS
========================================== */

// Obtener todas las recurrencias
router.get("/", getRecurrences);

// Obtener recurrencia por ID
router.get("/:id", getRecurrence);

// Obtener recurrencias por recordatorio
router.get("/reminder/:reminderId", getRecurrenceByReminderId);

// Crear recurrencia
router.post("/", createNewRecurrence);

// Actualizar recurrencia
router.put("/:id", updateRecurrenceById);

// Eliminar recurrencia
router.delete("/:id", deleteRecurrenceById);

export default router;  