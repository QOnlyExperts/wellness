// application/mappers/UserMapper.ts
import { UserEntity } from "../../domain/entities/UserEntity";
import { RoleEntity } from "../../domain/entities/RoleEntity";
import { InfoPersonEntity } from "../../domain/entities/InfoPersonEntity";
import { InfoPersonMapper } from "./InfoPersonMapper";
import { ProgramEntity } from "../../domain/entities/ProgramEntity";
import { RoleMapper } from "./RoleMapper";

export class UserMapper {
  /**
   * Entidad -> DTO plano para salida (oculta password/salt)
   */
  public static toOutputDto(user: UserEntity): any {
    return {
      id: user.id,
      email: user.email,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login ?? null,
      info_person_id: user.info_person_id,
      rol_id: user.rol_id,
      info_person: user.info_person ? InfoPersonMapper.toOutputDto(user.info_person) : null,
      rol: user.rol
        ? {
            id: user.rol.id,
            name: user.rol.name,
            status: user.rol.status,
          }
        : null,
    };
  }

  /**
   * Objeto plano (por ejemplo modelo Sequelize con relaciones incluidas)
   * -> Entidad de dominio UserEntity
   *
   * Espera que las relaciones vengan en `data.InfoPerson` y `data.Role`
   * (igual que en tus otros mappers). Ajusta si tu modelo usa otros alias.
   */
  public static toDomain(data: any): UserEntity {

    // Role (si viene cargada desde Sequelize)
    const rol: RoleEntity | undefined = data.Role
      ? RoleMapper.toDomain(data.Role)
      : undefined;

    // InfoPerson (si viene cargada desde Sequelize)
    const infoPerson: InfoPersonEntity | undefined = data.InfoPerson
      ? InfoPersonMapper.toDomain(data.InfoPerson)
      : undefined;

    return UserEntity.create({
      id: data.id ?? null,
      email: data.email,
      password: data.password ?? "",
      salt: data.salt ?? "",
      is_verified: data.is_verified ?? false,
      is_active: data.is_active ?? false,
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
      updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
      last_login: data.last_login ? new Date(data.last_login) : new Date(),
      info_person_id: data.info_person_id,
      rol_id: data.rol_id,
      info_person: infoPerson,
      rol,
    });
  }

  /**
   * Entidad -> Objeto plano para persistencia (no parcial).
   * Incluye los FK info_person_id y rol_id si existen.
   *
   * Útil para create/update completos en repositorio.
   */
  public static toPersistence(user: UserEntity): any {
    const data: any = {
      id: user.id ?? undefined,
      email: user.email,
      password: user.password,
      salt: user.salt,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login ?? null,
      info_person_id: user.info_person_id?? null,
      rol_id: user.rol_id ?? null,
      // info_person: user.info_person?.id ?? null,
      // role: user.role?.id ?? null,
    };

    // Elimina campos undefined para que el repo los ignore al crear/actualizar
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    return data;
  }
}
