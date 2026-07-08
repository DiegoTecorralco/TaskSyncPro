import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Category = sequelize.define("Category", {
        categoria_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        tableName: "categorias",
        timestamps: false,
        freezeTableName: true
    });

    // Relaciones
    Category.associate = (models) => {
        Category.hasMany(models.Reminder, {
            foreignKey: "categoria_id",
            as: "recordatorios"
        });
    };

    return Category;
};