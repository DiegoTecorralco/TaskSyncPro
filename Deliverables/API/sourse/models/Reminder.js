import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Reminder = sequelize.define("Reminder", {
        recordatorio_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "usuarios",
                key: "usuario_id"
            }
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "categorias",
                key: "categoria_id"
            }
        },
        titulo: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: "título" // ⚠️ IMPORTANTE: mapea con el nombre real en BD
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 🔥 Se genera automáticamente
        },
        notificado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: "recordatorios",
        timestamps: true,
        createdAt: "fecha_creacion",
        updatedAt: false,
        freezeTableName: true
    });

    // Relaciones
    Reminder.associate = (models) => {
        Reminder.belongsTo(models.User, {
            foreignKey: "usuario_id",
            as: "usuario"
        });

        Reminder.belongsTo(models.Category, {
            foreignKey: "categoria_id",
            as: "categoria"
        });

        Reminder.hasOne(models.Task, {
            foreignKey: "recordatorio_id",
            as: "recurrencia"
        });
    };

    return Reminder;
};