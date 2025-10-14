import { IImplementRepository } from "../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../domain/entities/ImplementEntity";
import { ImplementModel } from "../models/ImplementModel";
import e from "express";

export class SequelizeImplementRepository implements IImplementRepository {


  async findAll(): Promise<ImplementEntity[]> {
    const implementList = await ImplementModel.findAll();
    return implementList.map(imp => ImplementEntity.fromPersistence(imp.toJSON()));
  }

  async findById(id: number): Promise<ImplementEntity | null> {
    const implement = await ImplementModel.findByPk(id);
    if (!implement) {
      return null;
    }

    // Mapeo: Transforma el modelo de Sequelize a la Entidad pura
    return ImplementEntity.fromPersistence(implement.toJSON());
  }

  async save(implement: ImplementEntity): Promise<ImplementEntity> {
    // Convertir la Entidad de Dominio a un objeto plano para Sequelize
    const persistenceData = implement.toPersistence();
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
    return ImplementEntity.fromPersistence(saveModel.toJSON());
  }
}