import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { IJwtService } from "../../domain/interfaces/services/IJwtService";

type JwtExpiry = SignOptions['expiresIn']; // use the same type as jsonwebtoken's SignOptions.expiresIn

export class JwtService implements IJwtService {
  private readonly secret: string;
  private expiresIn: JwtExpiry;

  constructor(secret: string, expiresIn: JwtExpiry = "1h") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  setExpiresIn(expiresIn: JwtExpiry): void {
    this.expiresIn = expiresIn;
  }


  sign(payload: object): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret as jwt.Secret, options);
  }

  verify(token: string): JwtPayload | string {
    try {
      return jwt.verify(token, this.secret as jwt.Secret);
    } catch (error) { //'error' es de tipo 'unknown' aquí

      // 1. Aplicamos el Type Guard para asegurarnos de que es un objeto Error
      if (error instanceof Error) {
        
        // 2. Verificamos el tipo de error específico de jsonwebtoken
        if (error.name === 'TokenExpiredError') {
          throw new Error("Token expirado"); // Mensaje para expiración
        }
        
        // 3. Manejamos otros errores de JWT (firma inválida, token mal formado, etc.)
        throw new Error("Token inválido"); 
      }
      
      // 4. Si el error no es una instancia de Error, lanzamos un error genérico
      throw new Error("Ocurrió un error de verificación inesperado");
    }
  }
}
