import { IRoleRepository } from "../../domain/interfaces/IRoleRepository";
import { RoleEntity } from "../../domain/entities/RoleEntity";
import { RoleModel } from "../models/RoleModel";
import { RoleMapper } from "../../application/mappers/RoleMapper";

/**
 * Implementación del repositorio de Roles usando Sequelize.
 */
export class SequelizeRoleRepository implements IRoleRepository {
  /**
   * NOTA: El 'RoleMapper' lo crearemos en el siguiente paso.
   * Es normal que te marque un error en esa línea por ahora.
   */

  async findAll(): Promise<RoleEntity[]> {
    const roleModels = await RoleModel.findAll();
    return roleModels.map((model) => RoleMapper.toDomain(model.toJSON()));
  }

  async findById(id: number): Promise<RoleEntity | null> {
    const roleModel = await RoleModel.findByPk(id);
    if (!roleModel) {
      return null;
    }
    return RoleMapper.toDomain(roleModel.toJSON());
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const roleModel = await RoleModel.findOne({ where: { name } });
    if (!roleModel) {
      return null;
    }
    return RoleMapper.toDomain(roleModel.toJSON());
  }

  async save(role: RoleEntity): Promise<RoleEntity> {
    const persistenceData = RoleMapper.toPersistence(role);
    let savedModel: RoleModel;

    if (role.id && role.id !== 0) {
      // Actualizar
      await RoleModel.update(persistenceData, { where: { id: role.id } });
      savedModel = (await RoleModel.findByPk(role.id))!;
    } else {
      // Crear
      // Quitamos el 'id' nulo para que la base de datos asigne uno nuevo
      const { id, ...dataToCreate } = persistenceData;
      savedModel = await RoleModel.create(dataToCreate);
    }

    return RoleMapper.toDomain(savedModel.toJSON());
  }
}