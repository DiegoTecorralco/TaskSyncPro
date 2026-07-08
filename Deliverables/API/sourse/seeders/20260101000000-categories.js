export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("categorias", [
            { nombre: "Trabajo" },
            { nombre: "Personal" },
            { nombre: "Estudio" },
            { nombre: "Salud" },
            { nombre: "Finanzas" },
            { nombre: "Familia" },
            { nombre: "Social" },
            { nombre: "Otros" }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("categorias", null, {});
    }
};