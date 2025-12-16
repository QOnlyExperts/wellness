import { Request, Response, NextFunction } from "express";
import { resolveJwtTokenService } from "../../../composition/compositionRoot";

export function authMiddleware() {
  const jwtService = resolveJwtTokenService();

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Si usas cookies
      const token = req.cookies.access_token;
      console.log(token);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No autenticado",
        });
      }

      const payload = jwtService.verify(token);

      // Inyectas el usuario al request
      (req as any).user = payload;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }
  };
}
