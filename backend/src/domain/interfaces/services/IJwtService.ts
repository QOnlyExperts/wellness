import { SignOptions } from "jsonwebtoken";

type JwtExpiry = SignOptions['expiresIn'];

export interface IJwtService {
  setExpiresIn(expiresIn: JwtExpiry): void;
  sign(payload: object): string;
  verify(token: string): any;
}
