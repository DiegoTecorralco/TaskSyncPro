// routes/ml.routes.js
import { Router } from "express";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/database.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Endpoint: Análisis predictivo de un usuario
router.post("/predict/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        // 1. Obtener los datos del usuario desde la BD (ETL en tiempo real)
        const [rows] = await pool.query(
            `SELECT * FROM vw_ml_data WHERE usuario_id = ?`, 
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no tiene datos suficientes para análisis" });
        }
        
        const userData = rows[0];
        
        // 2. Preparar el payload para Python
        const payload = {
            total_tareas: userData.total_tareas || 0,
            tareas_completadas: userData.tareas_completadas || 0,
            antiguedad_dias: userData.antiguedad_dias || 0
        };
        
        // 3. Ejecutar el script de Python
        const pythonScript = path.join(__dirname, "../ml_engine/predict.py");
        const pythonArgs = [pythonScript, JSON.stringify(payload)];
        
        exec(`python ${pythonArgs.join(' ')}`, (error, stdout, stderr) => {
            if (error) {
                console.error("Error en Python:", stderr);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error en el motor de Machine Learning", 
                    error: stderr 
                });
            }
            
            // 4. Devolver la respuesta de Python al Frontend
            const result = JSON.parse(stdout);
            return res.status(200).json({
                success: true,
                message: "Análisis predictivo completado",
                data: result
            });
        });
        
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Error interno", 
            error: error.message 
        });
    }
});

export default router;