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

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
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
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
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
                message: 'Nombre, correo y contraseña son requeridos' 
            });
        }

        // Verificar si el correo ya existe
        const existingUser = await getUserByEmail(correo);
        if (existingUser) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        const [result] = await pool.query(
            `INSERT INTO usuarios 
            (nombre, apellido_paterno, apellido_materno, correo, password)
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, apellido_paterno || null, apellido_materno || null, correo, password]
        );

        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            usuario_id: result.insertId 
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario' });
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
        const userExists = await getUserByEmail(correo);
        if (!userExists) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
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
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

/* ==========================================
   ELIMINAR USUARIO
========================================== */
export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `DELETE FROM usuarios WHERE usuario_id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};