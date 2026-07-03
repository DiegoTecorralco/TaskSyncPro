import { Router } from "express";

import {
    getCategories,
    getCategory,
    createNewCategory,
    updateCategoryById,
    deleteCategoryById
} from "../controllers/category.controller.js";

const router = Router();

/* ==========================================
   RUTAS DE CATEGORÍAS
========================================== */

// Obtener todas las categorías
router.get("/", getCategories);

// Obtener categoría por ID
router.get("/:id", getCategory);

// Crear categoría
router.post("/", createNewCategory);

// Actualizar categoría
router.put("/:id", updateCategoryById);

// Eliminar categoría
router.delete("/:id", deleteCategoryById);

export default router;