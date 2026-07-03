import {
    getAllReminders,
    getReminderById,
    getRemindersByUser,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsNotified
} from "../DAO/reminder.dao.js";

import { successResponse, errorResponse } from "../utils/response.js";

/* ==========================================
   OBTENER TODOS LOS RECORDATORIOS
========================================== */

export const getReminders = async (req, res) => {
    try {

        const reminders = await getAllReminders();

        return successResponse(res, "Recordatorios obtenidos correctamente", reminders);

    } catch (error) {
        return errorResponse(res, "Error al obtener recordatorios", 500, error.message);
    }
};

/* ==========================================
   OBTENER POR ID
========================================== */

export const getReminder = async (req, res) => {
    try {

        const { id } = req.params;

        const reminder = await getReminderById(id);

        if (!reminder) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        return successResponse(res, "Recordatorio encontrado", reminder);

    } catch (error) {
        return errorResponse(res, "Error al obtener recordatorio", 500, error.message);
    }
};

/* ==========================================
   OBTENER POR USUARIO
========================================== */

export const getRemindersUser = async (req, res) => {
    try {

        const { userId } = req.params;

        const reminders = await getRemindersByUser(userId);

        return successResponse(res, "Recordatorios del usuario obtenidos", reminders);

    } catch (error) {
        return errorResponse(res, "Error al obtener recordatorios del usuario", 500, error.message);
    }
};

/* ==========================================
   CREAR RECORDATORIO
========================================== */

export const createNewReminder = async (req, res) => {
    try {

        const {
            usuario_id,
            categoria_id,
            titulo,
            descripcion,
            fecha
        } = req.body;

        if (!titulo || !fecha || !usuario_id) {
            return errorResponse(res, "Datos incompletos", 400);
        }

        const reminderId = await createReminder({
            usuario_id,
            categoria_id,
            titulo,
            descripcion,
            fecha
        });

        return successResponse(res, "Recordatorio creado correctamente", {
            recordatorio_id: reminderId
        });

    } catch (error) {
        return errorResponse(res, "Error al crear recordatorio", 500, error.message);
    }
};

/* ==========================================
   ACTUALIZAR RECORDATORIO
========================================== */

export const updateReminderById = async (req, res) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const updated = await updateReminder(id, data);

        if (!updated) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        return successResponse(res, "Recordatorio actualizado correctamente");

    } catch (error) {
        return errorResponse(res, "Error al actualizar recordatorio", 500, error.message);
    }
};

/* ==========================================
   ELIMINAR RECORDATORIO
========================================== */

export const deleteReminderById = async (req, res) => {
    try {

        const { id } = req.params;

        const deleted = await deleteReminder(id);

        if (!deleted) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        return successResponse(res, "Recordatorio eliminado correctamente");

    } catch (error) {
        return errorResponse(res, "Error al eliminar recordatorio", 500, error.message);
    }
};

/* ==========================================
   MARCAR COMO NOTIFICADO
========================================== */

export const markReminderAsNotified = async (req, res) => {
    try {

        const { id } = req.params;

        await markAsNotified(id);

        return successResponse(res, "Recordatorio marcado como notificado");

    } catch (error) {
        return errorResponse(res, "Error al actualizar estado", 500, error.message);
    }
};