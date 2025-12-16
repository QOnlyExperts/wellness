import { Request, Response, NextFunction } from "express";

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // lo inyecta authMiddleware

    if (!user || !user.rol) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    if (!allowedRoles.includes(user.rol)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para esta acción",
      });
    }

    next();
  };
}
