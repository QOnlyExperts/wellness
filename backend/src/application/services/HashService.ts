// infrastructure/services/HashService.ts
import bcrypt from "bcrypt";
import { IHashService } from "../../domain/interfaces/services/IHashService";
import { ValidationError } from "../../shared/errors/DomainErrors";

export class HashService implements IHashService {
  private readonly rounds:number = 10;
  private saltUser: string = "";

  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.rounds);
    this.saltUser = salt;
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed);
  }

  async salt(): Promise<string> {
    if(this.saltUser === ""){
      throw new ValidationError("Genere primero un hash de contraseña");
    }
    return this.saltUser;;
  }
}
