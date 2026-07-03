import { Router } from "express";

import {
    getUsers,
    getUser,
    createNewUser,
    updateUserById,
    deleteUserById
} from "../controllers/user.controller.js";

const router = Router();



// Obtener todos los usuarios
router.get("/", getUsers);

// Obtener usuario por ID
router.get("/:id", getUser);

// Crear usuario
router.post("/", createUser);

// Actualizar usuario
router.put("/:id", updateUserById);

// Eliminar usuario
router.delete("/:id", deleteUserById);

export default router;