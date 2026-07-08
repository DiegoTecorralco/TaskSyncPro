import {
    getPendingTasks,
    getCompletedTasks,
    countTasksByUser
} from "../services/task.service.js";

/* ==========================================
   DASHBOARD DE TAREAS
========================================== */
export const getTaskDashboard = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await countTasksByUser(userId);

        return res.status(200).json({
            success: true,
            message: "Dashboard de tareas",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error dashboard tasks",
            error: error.message
        });
    }
};

/* ==========================================
   TAREAS PENDIENTES
========================================== */
export const getPending = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await getPendingTasks(userId);

        return res.status(200).json({
            success: true,
            message: "Tareas pendientes",
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error pendientes",
            error: error.message
        });
    }
};

/* ==========================================
   TAREAS COMPLETADAS
========================================== */
export const getCompleted = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await getCompletedTasks(userId);

        return res.status(200).json({
            success: true,
            message: "Tareas completadas",
            data: tasks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error completadas",
            error: error.message
        });
    }
};