import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import pool from "./config/database.js";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";

const app = express();

/* ============================
   MIDDLEWARES
============================ */
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================
      RUTA PRINCIPAL
============================ */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "TaskSync Pro API",
        version: "1.0.0",
        message: "API funcionando correctamente."
    });
});

/* ============================
        API ROUTES
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reminders", reminderRoutes);

/* ============================
     RUTA NO ENCONTRADA
============================ */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada."
    });
});

/* ============================
   MANEJO GLOBAL DE ERRORES
============================ */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Error interno del servidor."
    });
});

/* ============================
   INICIAR SERVIDOR
============================ */
const PORT = process.env.PORT || 3000;

// Verificar conexión a la BD y luego iniciar
(async () => {
    console.log('═══════════════════════════════════════');
    console.log('   🚀 TASKSYNC PRO API');
    console.log('═══════════════════════════════════════');
    
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('✅ Conexión a la base de datos: OK');
    } catch (error) {
        console.error('❌ Error de conexión a la BD:', error.message);
    }
    
    app.listen(PORT, () => {
        console.log(`✅ Servidor: http://localhost:${PORT}`);
        console.log('═══════════════════════════════════════');
    });
})();

export default app;