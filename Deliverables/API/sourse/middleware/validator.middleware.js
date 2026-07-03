import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";


export const validateFields = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return errorResponse(
            res,
            "Errores de validación",
            400,
            errors.array()
        );
    }

    next();
};