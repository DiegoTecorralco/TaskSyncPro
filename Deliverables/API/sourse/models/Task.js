import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Task = sequelize.define("Task", {
        recurrencia_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        recordatorio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "recordatorios",
                key: "recordatorio_id"
            }
        },
        tipo: {
            type: DataTypes.ENUM("diario", "semanal", "mensual", "horario"),
            allowNull: false
        },
        intervalo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        }
    }, {
        tableName: "recurrencias",
        timestamps: false,
        freezeTableName: true
    });

    // Relaciones
    Task.associate = (models) => {
        Task.belongsTo(models.Reminder, {
            foreignKey: "recordatorio_id",
            as: "recordatorio"
        });
    };

    return Task;
};