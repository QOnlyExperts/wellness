import { IProgramRepository } from "../../domain/interfaces/IProgramRepository";
import { ProgramEntity } from "../../domain/entities/ProgramEntity";
import { ProgramModel } from "../models/ProgramModel"; // Importamos el modelo que acabamos de crear
import { ProgramMapper } from "../../application/mappers/ProgramMapper"; // (Este dará error hasta el siguiente paso)

/**
 * Implementación del repositorio de Programas usando Sequelize.
 * Sigue el patrón de SequelizeGroupImplementRepository.
 */
export class SequelizeProgramRepository implements IProgramRepository {

  async findAll(): Promise<ProgramEntity[]> {
    const records = await ProgramModel.findAll();
    // NOTA: El 'ProgramMapper' lo crearemos en el siguiente paso.
    // Es normal que marque un error aquí por ahora.
    return records.map(record => ProgramMapper.toDomain(record.toJSON()));
  }

  async findById(id: number): Promise<ProgramEntity | null> {
    const record = await ProgramModel.findByPk(id);
    if (!record) return null;
    return ProgramMapper.toDomain(record.toJSON());
  }

  async findByName(name: string): Promise<ProgramEntity | null> {
    const record = await ProgramModel.findOne({ where: { name } });
    return record ? ProgramMapper.toDomain(record.toJSON()) : null;
  }

  async findByCod(cod: string): Promise<ProgramEntity | null> {
    const record = await ProgramModel.findOne({ where: { cod } });
    return record ? ProgramMapper.toDomain(record.toJSON()) : null;
  }

  async save(entity: ProgramEntity): Promise<ProgramEntity> {
    const persistenceData = ProgramMapper.toPersistence(entity);
    let record: ProgramModel;

    // Lógica de guardar/actualizar idéntica a la de GroupImplement
    if (entity.id && entity.id !== 0) {
      // Actualizar
      await ProgramModel.update(persistenceData, { where: { id: entity.id } });
      record = (await ProgramModel.findByPk(entity.id))!;
    } else {
      // Crear (quitando el ID nulo)
      const { id, ...dataToCreate } = persistenceData;
      record = await ProgramModel.create(dataToCreate);
    }

    return ProgramMapper.toDomain(record.toJSON());
  }
}