import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();


// Registro de usuario
router.post("/register", register);

// Login de usuario
router.post("/login", login);

export default router;