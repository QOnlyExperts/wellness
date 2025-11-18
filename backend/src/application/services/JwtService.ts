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

  setExpiresIn(expiresIn: JwtExpiry) {
    this.expiresIn = expiresIn;
  }


  sign(payload: object): string {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret as jwt.Secret, options);
  }

  verify(token: string): JwtPayload | string {
    try {
      return jwt.verify(token, this.secret as jwt.Secret);
    } catch {
      throw new Error("Token inválido o expirado");
    }
  }
}
