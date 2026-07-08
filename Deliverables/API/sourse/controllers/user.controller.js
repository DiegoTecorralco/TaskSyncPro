import pool from "../config/database.js";

/* ==========================================
   OBTENER TODOS LOS USUARIOS
========================================== */
export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                usuario_id,
                nombre,
                apellido_paterno,
                apellido_materno,
                correo,
                fecha_registro,
                fecha_actualizacion
             FROM usuarios`
        );

        return res.status(200).json({
            success: true,
            message: "Usuarios obtenidos correctamente",
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER USUARIO POR ID
========================================== */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(
            `SELECT 
                usuario_id,
                nombre,
                apellido_paterno,
                apellido_materno,
                correo,
                fecha_registro,
                fecha_actualizacion
             FROM usuarios
             WHERE usuario_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario encontrado",
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener usuario",
            error: error.message
        });
    }
};

/* ==========================================
   OBTENER USUARIO POR CORREO (para uso interno)
========================================== */
export const getUserByEmail = async (correo) => {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios WHERE correo = ?`,
        [correo]
    );
    return rows[0];
};

/* ==========================================
   CREAR USUARIO
========================================== */
export const createUser = async (req, res) => {
    try {
        const {
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            password
        } = req.body;

        // Validar datos requeridos
        if (!nombre || !correo || !password) {
            return res.status(400).json({
                success: false,
                message: "Nombre, correo y contraseña son requeridos"
            });
        }

        // Verificar si el correo ya existe
        const existingUser = await getUserByEmail(correo);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "El correo ya está registrado"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO usuarios 
            (nombre, apellido_paterno, apellido_materno, correo, password)
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, apellido_paterno || null, apellido_materno || null, correo, password]
        );

        return res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            data: {
                usuario_id: result.insertId
            }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({
            success: false,
            message: "Error al crear usuario",
            error: error.message
        });
    }
};

/* ==========================================
   ACTUALIZAR USUARIO
========================================== */
export const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            apellido_paterno,
            apellido_materno,
            correo
        } = req.body;

        // Verificar si el usuario existe
        const [userRows] = await pool.query(
            `SELECT usuario_id FROM usuarios WHERE usuario_id = ?`,
            [id]
        );
        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Si se envía correo, verificar que no esté en uso por otro usuario
        if (correo) {
            const [existing] = await pool.query(
                `SELECT usuario_id FROM usuarios WHERE correo = ? AND usuario_id != ?`,
                [correo, id]
            );
            if (existing.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "El correo ya está en uso por otro usuario"
                });
            }
        }

        const [result] = await pool.query(
            `UPDATE usuarios 
             SET nombre = ?, 
                 apellido_paterno = ?, 
                 apellido_materno = ?, 
                 correo = ?
             WHERE usuario_id = ?`,
            [nombre, apellido_paterno, apellido_materno, correo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "No se pudo actualizar el usuario"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente"
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: error.message
        });
    }
};

/* ==========================================
   ELIMINAR USUARIO
========================================== */
export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar existencia
        const [userRows] = await pool.query(
            `SELECT usuario_id FROM usuarios WHERE usuario_id = ?`,
            [id]
        );
        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const [result] = await pool.query(
            `DELETE FROM usuarios WHERE usuario_id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "No se pudo eliminar el usuario"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar usuario",
            error: error.message
        });
    }
};