import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "./env.js";
import pool from "./database.js";

// Mapa para almacenar conexiones de usuarios activos
const userConnections = new Map();

// Crear servidor Socket.io
let io;

export const initSocket = (app) => {
    const server = createServer(app);
    io = new Server(server, {
        cors: {
            origin: "*", // En producción, restringir a dominios específicos
            methods: ["GET", "POST"]
        }
    });

    // Middleware de autenticación para Socket.io
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Token no proporcionado"));
            }

            const decoded = jwt.verify(token, env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error("Token inválido"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Usuario conectado: ${socket.user.usuario_id}`);

        // Registrar usuario en el mapa
        userConnections.set(socket.user.usuario_id, socket.id);

        // Unirse a sala personal
        socket.join(`user-${socket.user.usuario_id}`);

        // Escuchar eventos personalizados
        socket.on("subscribe-notifications", async (data) => {
            socket.join(`notifications-${socket.user.usuario_id}`);
            socket.emit("subscribed", { message: "Suscripción a notificaciones exitosa" });
        });

        // Evento para pruebas
        socket.on("test-notification", (data) => {
            console.log("Test notification:", data);
            socket.emit("notification-test", {
                message: "Notificación de prueba recibida",
                timestamp: new Date()
            });
        });

        // Desconexión
        socket.on("disconnect", () => {
            console.log(`Usuario desconectado: ${socket.user.usuario_id}`);
            userConnections.delete(socket.user.usuario_id);
            socket.leave(`user-${socket.user.usuario_id}`);
            socket.leave(`notifications-${socket.user.usuario_id}`);
        });
    });

    return { server, io };
};

// Función para enviar notificación a un usuario específico
export const sendNotificationToUser = (userId, notification) => {
    if (!io) return false;

    try {
        const socketId = userConnections.get(userId);

        if (socketId) {
            io.to(`user-${userId}`).emit("reminder-notification", notification);
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error al enviar notificación:", error);
        return false;
    }
};

// Función para emitir recordatorio a todos los usuarios conectados
export const emitReminderAlert = (reminder) => {
    if (!io) return false;

    try {
        const notification = {
            recordatorio_id: reminder.recordatorio_id,
            titulo: reminder.titulo,
            descripcion: reminder.descripcion,
            fecha: reminder.fecha,
            timestamp: new Date()
        };

        io.to(`user-${reminder.usuario_id}`).emit("reminder-notification", notification);
        return true;
    } catch (error) {
        console.error("Error al emitir recordatorio:", error);
        return false;
    }
};

export { io };