export default {
    up: async (queryInterface, Sequelize) => {
        // 1. Crear tabla usuarios
        await queryInterface.createTable("usuarios", {
            usuario_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            apellido_paterno: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            apellido_materno: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            correo: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            fecha_registro: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            fecha_actualizacion: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
            }
        });

        // 2. Crear tabla categorias
        await queryInterface.createTable("categorias", {
            categoria_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            }
        });

        // 3. Crear tabla recordatorios
        await queryInterface.createTable("recordatorios", {
            recordatorio_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            usuario_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "usuarios",
                    key: "usuario_id"
                },
                onDelete: "CASCADE"
            },
            categoria_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "categorias",
                    key: "categoria_id"
                },
                onDelete: "SET NULL"
            },
            título: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            descripcion: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            fecha: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            notificado: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            fecha_creacion: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });

        // 4. Crear tabla recurrencias
        await queryInterface.createTable("recurrencias", {
            recurrencia_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            recordatorio_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "recordatorios",
                    key: "recordatorio_id"
                },
                onDelete: "CASCADE"
            },
            tipo: {
                type: Sequelize.ENUM("diario", "semanal", "mensual", "horario"),
                allowNull: false
            },
            intervalo: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        });

        // Índices
        await queryInterface.addIndex("recordatorios", ["usuario_id"]);
        await queryInterface.addIndex("recordatorios", ["fecha"]);
        await queryInterface.addIndex("recordatorios", ["notificado"]);
        await queryInterface.addIndex("recurrencias", ["recordatorio_id"]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("recurrencias");
        await queryInterface.dropTable("recordatorios");
        await queryInterface.dropTable("categorias");
        await queryInterface.dropTable("usuarios");
    }
};