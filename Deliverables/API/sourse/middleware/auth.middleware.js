import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No hay token de autenticación"
            });
        }

        // Formato: Bearer TOKEN
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no válido"
            });
        }

        // Verificar token
        const decoded = verifyToken(token);

        // Guardar usuario en request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token inválido o expirado",
            error: error.message
        });
    }
};