import { Sequelize } from "sequelize";
import { env } from "../config/env.js";

// Configuración de Sequelize
const sequelize = new Sequelize({
    dialect: "mysql",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});

// Importar y definir modelos
import User from "./User.js";
import Category from "./Category.js";
import Reminder from "./Reminder.js";
import Task from "./Task.js";

const models = {
    User: User(sequelize),
    Category: Category(sequelize),
    Reminder: Reminder(sequelize),
    Task: Task(sequelize)
};

// Configurar relaciones
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

// Verificar conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos OK');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        return false;
    }
};

export { sequelize, testConnection };
export default models;