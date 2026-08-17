import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: console.log
    }
);

async function runMigration() {
    try {
        await sequelize.authenticate();

        console.log("✅ Conexión a MySQL exitosa");

        const migration = await import(
            "./migrations/20260101000000-create-tables.js"
        );

        const queryInterface = sequelize.getQueryInterface();

        await migration.default.up(
            queryInterface,
            Sequelize
        );

        console.log("✅ Migración ejecutada correctamente");

    } catch (error) {
        console.error("❌ Error ejecutando migración:");
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

runMigration();