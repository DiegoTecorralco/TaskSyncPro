import { Router } from "express";
import {
    getTaskDashboard,
    getPending,
    getCompleted
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Dashboard
router.get("/dashboard/:userId", authMiddleware, getTaskDashboard);

// Pendientes
router.get("/pending/:userId", authMiddleware, getPending);

// Completadas
router.get("/completed/:userId", authMiddleware, getCompleted);

export default router;