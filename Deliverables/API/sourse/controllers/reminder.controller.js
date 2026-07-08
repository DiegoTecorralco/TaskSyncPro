import {
    getAllReminders,
    getReminderById,
    getRemindersByUser,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsNotified
} from "../DAO/reminder.dao.js";

/* ==========================================
   OBTENER TODOS LOS RECORDATORIOS
========================================== */
export const getReminders = async (req, res) => {
    try {
        const reminders = await getAllReminders();
        return res.status(200).json({
            success: true,
            message: "Recordatorios obtenidos correctamente",
            data: reminders
        });
    } catch (error) {
        console.error('Error en getReminders:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener recordatorios",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER POR ID
========================================== */
export const getReminder = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const reminder = await getReminderById(parseInt(id));

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Recordatorio no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recordatorio encontrado",
            data: reminder
        });
    } catch (error) {
        console.error('Error en getReminder:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener recordatorio",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER POR USUARIO
========================================== */
export const getRemindersUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "ID de usuario inválido"
            });
        }

        const reminders = await getRemindersByUser(parseInt(userId));

        return res.status(200).json({
            success: true,
            message: "Recordatorios del usuario obtenidos",
            data: reminders
        });
    } catch (error) {
        console.error('Error en getRemindersUser:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener recordatorios del usuario",
            error: error.message
        });
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
            return res.status(400).json({
                success: false,
                message: "Título, fecha y usuario son requeridos"
            });
        }

        if (isNaN(usuario_id)) {
            return res.status(400).json({
                success: false,
                message: "ID de usuario inválido"
            });
        }

        if (isNaN(Date.parse(fecha))) {
            return res.status(400).json({
                success: false,
                message: "Fecha inválida"
            });
        }

        const reminderId = await createReminder({
            usuario_id: parseInt(usuario_id),
            categoria_id: categoria_id ? parseInt(categoria_id) : null,
            titulo: titulo.trim(),
            descripcion: descripcion ? descripcion.trim() : null,
            fecha: fecha
        });

        return res.status(201).json({
            success: true,
            message: "Recordatorio creado correctamente",
            data: {
                recordatorio_id: reminderId
            }
        });

    } catch (error) {
        console.error('Error en createNewReminder:', error);
        return res.status(500).json({
            success: false,
            message: "Error al crear recordatorio",
            error: error.message
        });
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
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const existingReminder = await getReminderById(parseInt(id));
        if (!existingReminder) {
            return res.status(404).json({
                success: false,
                message: "Recordatorio no encontrado"
            });
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
            return res.status(500).json({
                success: false,
                message: "No se pudo actualizar el recordatorio"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recordatorio actualizado correctamente"
        });

    } catch (error) {
        console.error('Error en updateReminderById:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar recordatorio",
            error: error.message
        });
    }
};

/* ==========================================
   ELIMINAR RECORDATORIO
========================================== */
export const deleteReminderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const existingReminder = await getReminderById(parseInt(id));
        if (!existingReminder) {
            return res.status(404).json({
                success: false,
                message: "Recordatorio no encontrado"
            });
        }

        const deleted = await deleteReminder(parseInt(id));

        if (!deleted) {
            return res.status(500).json({
                success: false,
                message: "No se pudo eliminar el recordatorio"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recordatorio eliminado correctamente"
        });

    } catch (error) {
        console.error('Error en deleteReminderById:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar recordatorio",
            error: error.message
        });
    }
};

/* ==========================================
   MARCAR COMO NOTIFICADO
========================================== */
export const markReminderAsNotified = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const existingReminder = await getReminderById(parseInt(id));
        if (!existingReminder) {
            return res.status(404).json({
                success: false,
                message: "Recordatorio no encontrado"
            });
        }

        if (existingReminder.notificado === 1) {
            return res.status(400).json({
                success: false,
                message: "El recordatorio ya está marcado como notificado"
            });
        }

        const result = await markAsNotified(parseInt(id));

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "No se pudo marcar como notificado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Recordatorio marcado como notificado"
        });

    } catch (error) {
        console.error('Error en markReminderAsNotified:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar estado",
            error: error.message
        });
    }
};