import { DataTypes } from "sequelize";

export default (sequelize) => {
    const User = sequelize.define("User", {
        usuario_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido_paterno: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido_materno: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: "usuarios",
        timestamps: true,
        createdAt: "fecha_registro",
        updatedAt: "fecha_actualizacion",
        freezeTableName: true
    });

    // Relaciones
    User.associate = (models) => {
        User.hasMany(models.Reminder, {
            foreignKey: "usuario_id",
            as: "recordatorios"
        });
    };

    return User;
};