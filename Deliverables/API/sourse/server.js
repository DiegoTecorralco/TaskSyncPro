import app from "./app.js";
import pool from "./config/database.js";
import { env } from "./config/env.js";

const startServer = async () => {
    try {

        // Verificar conexión a MySQL
        const connection = await pool.getConnection();

        console.log("========================================");
        console.log("✅ Conexión a MySQL establecida.");
        console.log(`📂 Base de datos: ${env.DB_NAME}`);
        console.log("========================================");

        connection.release();

        // Iniciar servidor
        app.listen(env.PORT, () => {
            console.log("========================================");
            console.log("🚀 TaskSync Pro API iniciada");
            console.log(`🌐 URL: http://localhost:${env.PORT}`);
            console.log(`🛠️ Ambiente: ${env.NODE_ENV}`);
            console.log("========================================");
        });

    } catch (error) {

        console.error("========================================");
        console.error("❌ Error al conectar con MySQL");
        console.error(error.message);
        console.error("========================================");

        process.exit(1);

    }
};

startServer();