// src/presentation/routes/authRoutes.ts
import { Router, Request, Response } from "express";
import { authMiddleware } from "../http/middleware/authMiddleware";

const router = Router();

// Endpoint para validar token
router.get("/auth/validate-token", authMiddleware(), (req: Request, res: Response) => {
  // Si authMiddleware pasó, el token es válido
  const user = (req as any).user; // payload inyectado por middleware
  return res.status(200).json({
    success: true,
    message: "Token válido"
  });
});

export { router as authRoutes };