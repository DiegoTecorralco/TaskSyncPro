import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../DAO/category.dao.js";

import { successResponse, errorResponse } from "../utils/response.js";

/* ==========================================
   OBTENER TODAS LAS CATEGORÍAS
========================================== */

export const getCategories = async (req, res) => {
    try {

        const categories = await getAllCategories();

        return successResponse(res, "Categorías obtenidas correctamente", categories);

    } catch (error) {
        return errorResponse(res, "Error al obtener categorías", 500, error.message);
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
            return errorResponse(res, "Categoría no encontrada", 404);
        }

        return successResponse(res, "Categoría encontrada", category);

    } catch (error) {
        return errorResponse(res, "Error al obtener categoría", 500, error.message);
    }
};

/* ==========================================
   CREAR CATEGORÍA
========================================== */

export const createNewCategory = async (req, res) => {
    try {

        const { nombre } = req.body;

        if (!nombre) {
            return errorResponse(res, "El nombre es obligatorio", 400);
        }

        const categoryId = await createCategory(nombre);

        return successResponse(res, "Categoría creada correctamente", {
            categoria_id: categoryId
        });

    } catch (error) {
        return errorResponse(res, "Error al crear categoría", 500, error.message);
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
            return errorResponse(res, "Categoría no encontrada", 404);
        }

        return successResponse(res, "Categoría actualizada correctamente");

    } catch (error) {
        return errorResponse(res, "Error al actualizar categoría", 500, error.message);
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
            return errorResponse(res, "Categoría no encontrada", 404);
        }

        return successResponse(res, "Categoría eliminada correctamente");

    } catch (error) {
        return errorResponse(res, "Error al eliminar categoría", 500, error.message);
    }
};