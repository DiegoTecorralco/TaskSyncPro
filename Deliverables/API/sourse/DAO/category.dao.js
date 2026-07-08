import pool from "../config/database.js";

/* ==========================================
   OBTENER TODAS LAS CATEGORÍAS
========================================== */
export const getAllCategories = async () => {
    const [rows] = await pool.query(
        `SELECT 
            categoria_id,
            nombre
         FROM categorias`
    );
    return rows;
};

/* ==========================================
   OBTENER CATEGORÍA POR ID
========================================== */
export const getCategoryById = async (id) => {
    const [rows] = await pool.query(
        `SELECT 
            categoria_id,
            nombre
         FROM categorias
         WHERE categoria_id = ?`,
        [id]
    );
    return rows[0];
};

/* ==========================================
   CREAR CATEGORÍA
========================================== */
export const createCategory = async (nombre) => {
    const [result] = await pool.query(
        `INSERT INTO categorias (nombre)
         VALUES (?)`,
        [nombre]
    );
    return result.insertId;
};

/* ==========================================
   ACTUALIZAR CATEGORÍA
========================================== */
export const updateCategory = async (id, nombre) => {
    const [result] = await pool.query(
        `UPDATE categorias 
         SET nombre = ?
         WHERE categoria_id = ?`,
        [nombre, id]
    );
    return result.affectedRows;
};

/* ==========================================
   ELIMINAR CATEGORÍA
========================================== */
export const deleteCategory = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM categorias WHERE categoria_id = ?`,
        [id]
    );
    return result.affectedRows;
};