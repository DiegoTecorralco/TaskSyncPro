import { Router } from "express";
import { sendNotificationToUser } from "../config/socket.js";

const router = Router();

// Endpoint para probar notificaciones
router.post("/test/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { message, titulo, descripcion } = req.body;

        const notification = {
            message: message || "Notificación de prueba",
            titulo: titulo || "Test Notification",
            descripcion: descripcion || "Esta es una notificación de prueba",
            timestamp: new Date()
        };

        const sent = sendNotificationToUser(parseInt(userId), notification);

        return res.status(200).json({
            success: true,
            message: "Notificación enviada",
            data: {
                sent,
                userId,
                notification
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al enviar notificación",
            error: error.message
        });
    }
});

export default router;