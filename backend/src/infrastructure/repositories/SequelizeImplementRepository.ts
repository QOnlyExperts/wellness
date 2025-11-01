import { IImplementRepository } from "../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../domain/entities/ImplementEntity";
import { GroupImplementModel, ImgModel, ImplementModel } from "../models/indexModel";
import e from "express";
import { ImplementMapper } from "../../application/mappers/ImplementMapper";

export class SequelizeImplementRepository implements IImplementRepository {


  async findAll(): Promise<ImplementEntity[]> {
    const implementList = await ImplementModel.findAll({
      include: [{
          model: ImgModel,
          attributes: [
            'id',
            'file_name',
            'file_path',
            'mime_type',
            'description'
          ]
        },{
          model: GroupImplementModel,
          attributes: [
            'id',
            'name',
            'max_hours',
            'time_limit'
          ]
      }]
    });
    return implementList.map(imp => ImplementMapper.toDomain(imp.toJSON()));
  }

  async findById(id: number): Promise<ImplementEntity | null> {
    const implement = await ImplementModel.findByPk(id);
    if (!implement) {
      return null;
    }
    // Mapeo: Transforma el modelo de Sequelize a la Entidad pura
    return ImplementMapper.toDomain(implement.toJSON());
  }

  async findByIdGroup(idGroup: number): Promise<ImplementEntity[]> {
    const implementList = await ImplementModel.findAll({
      where: { 
        group_implement_id: idGroup 
      },
      include: [{
        model: ImgModel,
        attributes: [
          'id',
          'file_name',
          'file_path',
          'mime_type',
          'description'
        ]
      }]
    });
    return implementList.map(imp => ImplementMapper.toDomain(imp.toJSON()));
  }

  async save(implement: ImplementEntity): Promise<ImplementEntity> {
    // Convertir la Entidad de Dominio a un objeto plano para Sequelize
    const persistenceData = ImplementMapper.toPersistence(implement);
    let saveModel: ImplementModel;
    
    if(implement.id) {
      // Si ya tiene ID, actualizamos
      await ImplementModel.update(persistenceData, { where: { id: implement.id } });
      // Para devolver la entidad completa y consistente, la recuperamos (opcional pero seguro)
      // o simplemente usamos los datos de entrada, ya que no generamos nuevo ID.
      saveModel = await ImplementModel.findByPk(implement.id) as ImplementModel;

    }else{
      // Creamos nuevo
      // Sequelize.create() ejecuta el INSERT y devuelve la instancia del modelo, 
      // que ahora incluye el ID generado por la base de datos.
      saveModel = await ImplementModel.create(persistenceData);
    }
    
    // Mapear el Modelo de Sequelize guardado (que tiene el ID) de vuelta a la Entidad de Dominio.
    return ImplementMapper.toDomain(saveModel.toJSON());
  }

  // Actualizaciones parciales, que no tengan todos los parámetros
  async updatePartial(id: number, data: Partial<ImplementEntity>): Promise<ImplementEntity> {
    const persistenceData = ImplementMapper.toPersistence(data);
    await ImplementModel.update(persistenceData, { where: { id } });
    
    const updated = await ImplementModel.findByPk(id, {
      include: [{
          model: ImgModel,
          attributes: [
            'id',
            'file_name',
            'file_path',
            'mime_type',
            'description'
          ]
        },{
          model: GroupImplementModel,
          attributes: [
            'id',
            'name',
            'max_hours',
            'time_limit'
          ]
      }]
    });

    return ImplementMapper.toDomain(updated!.toJSON());
  }

  async updateMany(data: Partial<ImplementEntity>[]): Promise<void> {
    // Sacamos solo los datos que tengan un id valido
    const validData = data.filter(d => d.id != null);

    if (validData.length === 0) {
      throw new Error("No hay implementos válidos para actualizar");
    }

    await Promise.all(validData.map(async (d) => {
      const persistenceData = ImplementMapper.toPersistence(d);
      await ImplementModel.update(persistenceData, {
        where: { id: d.id! }, // el ! es seguro tras el filtro
      });
    }));
  }

  // Por si mas adelante quiero devolver los implementos actualizados en la funcion
  // async updateMany(data: Partial<ImplementEntity>[]): Promise<ImplementEntity[]> {
  //   const updatedEntities: ImplementEntity[] = [];

  //   for (const d of data) {
  //     if (!d.id) continue;
  //     const persistenceData = ImplementMapper.toPersistence(d);

  //     await ImplementModel.update(persistenceData, { where: { id: d.id } });

  //     const updated = await ImplementModel.findByPk(d.id, {
  //       include: [ImgModel, GroupImplementModel],
  //     });

  //     if (updated) {
  //       updatedEntities.push(ImplementMapper.toDomain(updated.toJSON()));
  //     }
  //   }

  //   return updatedEntities;
  // }

}