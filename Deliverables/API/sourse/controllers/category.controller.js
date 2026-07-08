import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../DAO/category.dao.js";

/* ==========================================
   OBTENER TODAS LAS CATEGORÍAS
========================================== */
export const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();

        return res.status(200).json({
            success: true,
            message: "Categorías obtenidas correctamente",
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener categorías",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER CATEGORÍA POR ID
========================================== */
export const getCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Categoría encontrada",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener categoría",
            error: error.message
        });
    }
};

/* ==========================================
   CREAR CATEGORÍA
========================================== */
export const createNewCategory = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: "El nombre es obligatorio"
            });
        }

        const categoryId = await createCategory(nombre);

        return res.status(201).json({
            success: true,
            message: "Categoría creada correctamente",
            data: {
                categoria_id: categoryId
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al crear categoría",
            error: error.message
        });
    }
};

/* ==========================================
   ACTUALIZAR CATEGORÍA
========================================== */
export const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const updated = await updateCategory(id, nombre);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Categoría actualizada correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar categoría",
            error: error.message
        });
    }
};

/* ==========================================
   ELIMINAR CATEGORÍA
========================================== */
export const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteCategory(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Categoría eliminada correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar categoría",
            error: error.message
        });
    }
};