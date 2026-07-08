import pool from "../config/database.js";
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
            return res.status(400).json({
                success: false,
                message: "El correo ya está registrado"
            });
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

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al registrar usuario",
            error: error.message
        });
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
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const user = rows[0];

        // Validar contraseña
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Contraseña incorrecta"
            });
        }

        // Generar token
        const token = generateToken({
            usuario_id: user.usuario_id,
            correo: user.correo
        });

        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            data: {
                token,
                user: {
                    usuario_id: user.usuario_id,
                    nombre: user.nombre,
                    apellido_paterno: user.apellido_paterno,
                    apellido_materno: user.apellido_materno,
                    correo: user.correo
                }
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error en login",
            error: error.message
        });
    }
};