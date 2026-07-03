import {
    getAllRecurrences,
    getRecurrenceById,
    getRecurrenceByReminder,
    createRecurrence,
    updateRecurrence,
    deleteRecurrence
} from "../DAO/recurrence.dao.js";

import { successResponse, errorResponse } from "../utils/response.js";

/* ==========================================
   OBTENER TODAS LAS RECURRENCIAS
========================================== */

export const getRecurrences = async (req, res) => {
    try {

        const recurrences = await getAllRecurrences();

        return successResponse(res, "Recurrencias obtenidas correctamente", recurrences);

    } catch (error) {
        return errorResponse(res, "Error al obtener recurrencias", 500, error.message);
    }
};

/* ==========================================
   OBTENER POR ID
========================================== */

export const getRecurrence = async (req, res) => {
    try {

        const { id } = req.params;

        const recurrence = await getRecurrenceById(id);

        if (!recurrence) {
            return errorResponse(res, "Recurrencia no encontrada", 404);
        }

        return successResponse(res, "Recurrencia encontrada", recurrence);

    } catch (error) {
        return errorResponse(res, "Error al obtener recurrencia", 500, error.message);
    }
};

/* ==========================================
   OBTENER POR RECORDATORIO
========================================== */

export const getRecurrenceByReminderId = async (req, res) => {
    try {

        const { reminderId } = req.params;

        const recurrence = await getRecurrenceByReminder(reminderId);

        return successResponse(res, "Recurrencias del recordatorio obtenidas", recurrence);

    } catch (error) {
        return errorResponse(res, "Error al obtener recurrencias", 500, error.message);
    }
};

/* ==========================================
   CREAR RECURRENCIA
========================================== */

export const createNewRecurrence = async (req, res) => {
    try {

        const {
            recordatorio_id,
            tipo,
            intervalo
        } = req.body;

        // Validación básica
        if (!recordatorio_id || !tipo || !intervalo) {
            return errorResponse(res, "Datos incompletos", 400);
        }

        const validTypes = ["diario", "semanal", "horario"];

        if (!validTypes.includes(tipo)) {
            return errorResponse(res, "Tipo de recurrencia inválido", 400);
        }

        const recurrenceId = await createRecurrence({
            recordatorio_id,
            tipo,
            intervalo
        });

        return successResponse(res, "Recurrencia creada correctamente", {
            recurrencia_id: recurrenceId
        });

    } catch (error) {
        return errorResponse(res, "Error al crear recurrencia", 500, error.message);
    }
};

/* ==========================================
   ACTUALIZAR RECURRENCIA
========================================== */

export const updateRecurrenceById = async (req, res) => {
    try {

        const { id } = req.params;
        const data = req.body;

        const updated = await updateRecurrence(id, data);

        if (!updated) {
            return errorResponse(res, "Recurrencia no encontrada", 404);
        }

        return successResponse(res, "Recurrencia actualizada correctamente");

    } catch (error) {
        return errorResponse(res, "Error al actualizar recurrencia", 500, error.message);
    }
};

/* ==========================================
   ELIMINAR RECURRENCIA
========================================== */

export const deleteRecurrenceById = async (req, res) => {
    try {

        const { id } = req.params;

        const deleted = await deleteRecurrence(id);

        if (!deleted) {
            return errorResponse(res, "Recurrencia no encontrada", 404);
        }

        return successResponse(res, "Recurrencia eliminada correctamente");

    } catch (error) {
        return errorResponse(res, "Error al eliminar recurrencia", 500, error.message);
    }
};