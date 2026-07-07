import { Router } from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById
} from "../controllers/user.controller.js";

const router = Router();



// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener usuario por ID
router.get("/:id", getUserById);

// Crear usuario
router.post("/", createUser);

// Actualizar usuario
router.put("/:id", updateUserById);

// Eliminar usuario
router.delete("/:id", deleteUserById);

export default router;