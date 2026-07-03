import pool from "../config/database.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";


export const register = async (req, res) => {
    try {
        const {
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            password
        } = req.body;

        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (existingUser.length > 0) {
            return errorResponse(res, "El correo ya está registrado", 400);
        }

        // Encriptar contraseña
        const hashedPassword = await hashPassword(password);

        // Insertar usuario
        await pool.query(
            `INSERT INTO usuarios 
            (nombre, apellido_paterno, apellido_materno, correo, password)
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, apellido_paterno, apellido_materno, correo, hashedPassword]
        );

        return successResponse(res, "Usuario registrado correctamente");

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error al registrar usuario", 500, error.message);
    }
};



export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscar usuario
        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (rows.length === 0) {
            return errorResponse(res, "Usuario no encontrado", 404);
        }

        const user = rows[0];

        // Validar contraseña
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return errorResponse(res, "Contraseña incorrecta", 401);
        }

        // Generar token
        const token = generateToken({
            usuario_id: user.usuario_id,
            correo: user.correo
        });

        return successResponse(res, "Login exitoso", {
            token,
            user: {
                usuario_id: user.usuario_id,
                nombre: user.nombre,
                apellido_paterno: user.apellido_paterno,
                apellido_materno: user.apellido_materno,
                correo: user.correo
            }
        });

    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error en login", 500, error.message);
    }
};