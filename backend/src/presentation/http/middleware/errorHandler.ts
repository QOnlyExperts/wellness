import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error capturado:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        type: err.type,
      },
    });
  }

  // Fallback para errores no controlados
  return res.status(500).json({
    success: false,
    error: {
      message: "Error interno del servidor",
      type: "InternalServerError",
    },
  });
}
