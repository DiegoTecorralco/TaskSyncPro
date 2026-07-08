import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";



export const authMiddleware = (req, res, next) => {
    try {

        // Obtener token del header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return errorResponse(res, "No hay token de autenticación", 401);
        }

        // Formato: Bearer TOKEN
        const token = authHeader.split(" ")[1];

        if (!token) {
            return errorResponse(res, "Token no válido", 401);
        }

        // Verificar token
        const decoded = verifyToken(token);

        // Guardar usuario en request
        req.user = decoded;

        next();

    } catch (error) {
        return errorResponse(res, "Token inválido o expirado", 401, error.message);
    }
};