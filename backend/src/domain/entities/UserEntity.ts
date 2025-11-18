// domain/entities/UserEntity.ts
import { ValidationError } from "../../shared/errors/DomainErrors";
import { RoleEntity } from "./RoleEntity";
import { InfoPersonEntity } from "./InfoPersonEntity";

export class UserEntity {
  public readonly id: number | null;
  public email: string;
  public password: string;
  public salt?: string;
  public is_verified: boolean;
  public is_active: boolean;
  public created_at: Date;
  public updated_at: Date;
  public last_login?: Date | null;
  public info_person_id: number;
  public rol_id: number;
  public info_person?: InfoPersonEntity;
  public rol?: RoleEntity;

  constructor(props: {
    id: number | null;
    email: string;
    password: string;
    salt?: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login?: Date | null;
    info_person_id: number;
    rol_id: number;
    info_person?: InfoPersonEntity;
    rol?: RoleEntity;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.salt = props.salt;
    this.is_verified = props.is_verified;
    this.is_active = props.is_active;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.last_login = props.last_login;
    this.info_person_id = props.info_person_id;
    this.rol_id = props.rol_id;
    this.info_person = props.info_person;
    this.rol = props.rol;
  }

  static create(props: {
    id: number | null;
    email: string;
    password: string;
    salt: string;
    is_verified?: boolean;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    last_login?: Date | null;
    info_person_id: number;
    rol_id: number;
    info_person?: InfoPersonEntity;
    rol?: RoleEntity;
  }): UserEntity {
    if (!props.email.includes("@campusucc.edu.co")) {
      throw new ValidationError("El correo electrónico no es válido");
    }



    return new UserEntity({
      id: props.id,
      email: props.email,
      password: props.password,
      salt: props.salt ?? "",
      is_verified: props.is_verified ?? false,
      is_active: props.is_active ?? false,
      created_at: props.created_at ?? new Date(),
      updated_at: props.updated_at ?? new Date(),
      last_login: props.last_login ?? new Date(),
      info_person_id: props.info_person_id,
      rol_id: props.rol_id,
      info_person: props.info_person,
      rol: props.rol,
    });
  }

  // ---- Métodos de dominio ----

  public verifyEmail() {
    if (this.is_verified) {
      throw new ValidationError("El correo ya fue verificado anteriormente");
    }
    this.is_verified = true;
  }

  public deactivate() {
    if (!this.is_active) {
      throw new ValidationError("El usuario ya está desactivado");
    }
    this.is_active = false;
  }

  public activate() {
    if (this.is_active) {
      throw new ValidationError("El usuario ya está activo");
    }
    this.is_active = true;
  }

  public updateLastLogin() {
    this.last_login = new Date();
  }
}
