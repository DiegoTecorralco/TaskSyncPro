import {
    getPendingTasks,
    getCompletedTasks,
    countTasksByUser
} from "../services/task.service.js";

import { successResponse, errorResponse } from "../utils/response.js";

/* ==========================================
   DASHBOARD DE TAREAS
========================================== */

export const getTaskDashboard = async (req, res) => {
    try {

        const { userId } = req.params;

        const data = await countTasksByUser(userId);

        return successResponse(res, "Dashboard de tareas", data);

    } catch (error) {
        return errorResponse(res, "Error dashboard tasks", 500, error.message);
    }
};

/* ==========================================
   TAREAS PENDIENTES
========================================== */

export const getPending = async (req, res) => {
    try {

        const { userId } = req.params;

        const tasks = await getPendingTasks(userId);

        return successResponse(res, "Tareas pendientes", tasks);

    } catch (error) {
        return errorResponse(res, "Error pendientes", 500, error.message);
    }
};

/* ==========================================
   TAREAS COMPLETADAS
========================================== */

export const getCompleted = async (req, res) => {
    try {

        const { userId } = req.params;

        const tasks = await getCompletedTasks(userId);

        return successResponse(res, "Tareas completadas", tasks);

    } catch (error) {
        return errorResponse(res, "Error completadas", 500, error.message);
    }
};