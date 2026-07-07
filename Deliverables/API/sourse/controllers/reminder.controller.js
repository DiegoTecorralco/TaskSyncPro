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
        console.error('Error en getReminders:', error);
        return errorResponse(res, "Error al obtener recordatorios", 500, error.message);
    }
};

/* ==========================================
   OBTENER POR ID
========================================== */
export const getReminder = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return errorResponse(res, "ID inválido", 400);
        }

        const reminder = await getReminderById(parseInt(id));

        if (!reminder) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        return successResponse(res, "Recordatorio encontrado", reminder);
    } catch (error) {
        console.error('Error en getReminder:', error);
        return errorResponse(res, "Error al obtener recordatorio", 500, error.message);
    }
};

/* ==========================================
   OBTENER POR USUARIO
========================================== */
export const getRemindersUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (isNaN(userId)) {
            return errorResponse(res, "ID de usuario inválido", 400);
        }

        const reminders = await getRemindersByUser(parseInt(userId));

        return successResponse(res, "Recordatorios del usuario obtenidos", reminders);
    } catch (error) {
        console.error('Error en getRemindersUser:', error);
        return errorResponse(res, "Error al obtener recordatorios del usuario", 500, error.message);
    }
};

/* ==========================================
   CREAR RECORDATORIO - ✅ Exportación correcta
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
            return errorResponse(res, "Título, fecha y usuario son requeridos", 400);
        }

        if (isNaN(usuario_id)) {
            return errorResponse(res, "ID de usuario inválido", 400);
        }

        if (isNaN(Date.parse(fecha))) {
            return errorResponse(res, "Fecha inválida", 400);
        }

        const reminderId = await createReminder({
            usuario_id: parseInt(usuario_id),
            categoria_id: categoria_id ? parseInt(categoria_id) : null,
            titulo: titulo.trim(),
            descripcion: descripcion ? descripcion.trim() : null,
            fecha: fecha
        });

        return successResponse(res, "Recordatorio creado correctamente", {
            recordatorio_id: reminderId
        });

    } catch (error) {
        console.error('Error en createNewReminder:', error);
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

        if (isNaN(id)) {
            return errorResponse(res, "ID inválido", 400);
        }

        const existingReminder = await getReminderById(parseInt(id));
        if (!existingReminder) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        const updateData = {
            categoria_id: data.categoria_id ? parseInt(data.categoria_id) : null,
            titulo: data.titulo ? data.titulo.trim() : existingReminder.titulo,
            descripcion: data.descripcion ? data.descripcion.trim() : existingReminder.descripcion,
            fecha: data.fecha || existingReminder.fecha,
            notificado: data.notificado !== undefined ? data.notificado : existingReminder.notificado
        };

        const updated = await updateReminder(parseInt(id), updateData);

        if (!updated) {
            return errorResponse(res, "No se pudo actualizar el recordatorio", 500);
        }

        return successResponse(res, "Recordatorio actualizado correctamente");

    } catch (error) {
        console.error('Error en updateReminderById:', error);
        return errorResponse(res, "Error al actualizar recordatorio", 500, error.message);
    }
};

/* ==========================================
   ELIMINAR RECORDATORIO
========================================== */
export const deleteReminderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return errorResponse(res, "ID inválido", 400);
        }

        const existingReminder = await getReminderById(parseInt(id));
        if (!existingReminder) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        const deleted = await deleteReminder(parseInt(id));

        if (!deleted) {
            return errorResponse(res, "No se pudo eliminar el recordatorio", 500);
        }

        return successResponse(res, "Recordatorio eliminado correctamente");

    } catch (error) {
        console.error('Error en deleteReminderById:', error);
        return errorResponse(res, "Error al eliminar recordatorio", 500, error.message);
    }
};

/* ==========================================
   MARCAR COMO NOTIFICADO
========================================== */
export const markReminderAsNotified = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return errorResponse(res, "ID inválido", 400);
        }

        const existingReminder = await getReminderById(parseInt(id));
        if (!existingReminder) {
            return errorResponse(res, "Recordatorio no encontrado", 404);
        }

        if (existingReminder.notificado === 1) {
            return errorResponse(res, "El recordatorio ya está marcado como notificado", 400);
        }

        const result = await markAsNotified(parseInt(id));

        if (!result) {
            return errorResponse(res, "No se pudo marcar como notificado", 500);
        }

        return successResponse(res, "Recordatorio marcado como notificado");

    } catch (error) {
        console.error('Error en markReminderAsNotified:', error);
        return errorResponse(res, "Error al actualizar estado", 500, error.message);
    }
};