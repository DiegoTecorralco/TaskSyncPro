export const successResponse = (res, message = "OK", data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, message = "Error", statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
};