import {
    getAllRecurrences,
    getRecurrenceById,
    getRecurrenceByReminder,
    createRecurrence,
    updateRecurrence,
    deleteRecurrence
} from "../services/recurrence.service.js";

/* ==========================================
   OBTENER TODAS LAS RECURRENCIAS
========================================== */
export const getRecurrences = async (req, res) => {
    try {
        const recurrences = await getAllRecurrences();

        return res.status(200).json({
            success: true,
            message: "Recurrencias obtenidas correctamente",
            data: recurrences
        });
    } catch (error) {
        console.error('Error en getRecurrences:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener recurrencias",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER RECURRENCIA POR ID
========================================== */
export const getRecurrence = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const recurrence = await getRecurrenceById(parseInt(id));

        if (!recurrence) {
            return res.status(404).json({
                success: false,
                message: "Recurrencia no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recurrencia encontrada",
            data: recurrence
        });
    } catch (error) {
        console.error('Error en getRecurrence:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener recurrencia",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER RECURRENCIAS POR RECORDATORIO
========================================== */
export const getRecurrenceByReminderId = async (req, res) => {
    try {
        const { reminderId } = req.params;

        if (isNaN(reminderId)) {
            return res.status(400).json({
                success: false,
                message: "ID de recordatorio inválido"
            });
        }

        const recurrences = await getRecurrenceByReminder(parseInt(reminderId));

        return res.status(200).json({
            success: true,
            message: "Recurrencias del recordatorio obtenidas",
            data: recurrences
        });
    } catch (error) {
        console.error('Error en getRecurrenceByReminderId:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener recurrencias",
            error: error.message
        });
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

        // Validación
        if (!recordatorio_id || !tipo || !intervalo) {
            return res.status(400).json({
                success: false,
                message: "Datos incompletos. Se requiere: recordatorio_id, tipo e intervalo"
            });
        }

        if (isNaN(recordatorio_id)) {
            return res.status(400).json({
                success: false,
                message: "ID de recordatorio inválido"
            });
        }

        const validTypes = ["diario", "semanal", "mensual", "horario"];
        if (!validTypes.includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: "Tipo de recurrencia inválido. Tipos válidos: diario, semanal, mensual, horario"
            });
        }

        if (isNaN(intervalo) || intervalo < 1) {
            return res.status(400).json({
                success: false,
                message: "Intervalo debe ser un número mayor a 0"
            });
        }

        const recurrenceId = await createRecurrence({
            recordatorio_id: parseInt(recordatorio_id),
            tipo,
            intervalo: parseInt(intervalo)
        });

        return res.status(201).json({
            success: true,
            message: "Recurrencia creada correctamente",
            data: {
                recurrencia_id: recurrenceId
            }
        });
    } catch (error) {
        console.error('Error en createNewRecurrence:', error);
        return res.status(500).json({
            success: false,
            message: "Error al crear recurrencia",
            error: error.message
        });
    }
};

/* ==========================================
   ACTUALIZAR RECURRENCIA
========================================== */
export const updateRecurrenceById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, intervalo } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const existingRecurrence = await getRecurrenceById(parseInt(id));
        if (!existingRecurrence) {
            return res.status(404).json({
                success: false,
                message: "Recurrencia no encontrada"
            });
        }

        const updateData = {
            tipo: tipo || existingRecurrence.tipo,
            intervalo: intervalo || existingRecurrence.intervalo
        };

        const updated = await updateRecurrence(parseInt(id), updateData);

        if (!updated) {
            return res.status(500).json({
                success: false,
                message: "No se pudo actualizar la recurrencia"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recurrencia actualizada correctamente"
        });
    } catch (error) {
        console.error('Error en updateRecurrenceById:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar recurrencia",
            error: error.message
        });
    }
};

/* ==========================================
   ELIMINAR RECURRENCIA
========================================== */
export const deleteRecurrenceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const existingRecurrence = await getRecurrenceById(parseInt(id));
        if (!existingRecurrence) {
            return res.status(404).json({
                success: false,
                message: "Recurrencia no encontrada"
            });
        }

        const deleted = await deleteRecurrence(parseInt(id));

        if (!deleted) {
            return res.status(500).json({
                success: false,
                message: "No se pudo eliminar la recurrencia"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recurrencia eliminada correctamente"
        });
    } catch (error) {
        console.error('Error en deleteRecurrenceById:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar recurrencia",
            error: error.message
        });
    }
};