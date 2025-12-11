
import { RequestEntity } from "../../domain/entities/RequestEntity";
import { IRequestRepository } from "../../domain/interfaces/IRequestRepository";
import { GroupImplementModel, ImgModel, ImplementModel, InfoPersonModel, LoginModel, RequestModel } from "../models/IndexModel";
import { RequestMapper } from "../../application/mappers/RequestMapper";
import { literal, Op, Transaction } from "sequelize";

export class SequelizeRequestRepository implements IRequestRepository {
  async findAll(): Promise<RequestEntity[]> {
    const requests = await RequestModel.findAll({
      // Implementación del Ordenamiento
      order: [
        [
          literal(`
            CASE 
              WHEN "Request"."status" = 'requested' THEN 1
              ELSE 0
            END
          `),
          'DESC'
        ],
        ['created_at', 'DESC'] // La fecha más reciente primero
      ],
      include: [
        {
          model: InfoPersonModel,
          include: [
            {
              model: LoginModel
            }
          ]
        },
        {
          model: ImplementModel,
          include:[
            {
              model: ImgModel
            },
            {
              model: GroupImplementModel
            }
          ]
        },
      ],
    });
    
    return requests.map((request) => RequestMapper.toDomain(request.toJSON()));
  }

  async findById(id: number): Promise<RequestEntity | null> {
    const request = await RequestModel.findByPk(id);
    if (!request) {
      return null;
    }
    return RequestMapper.toDomain(request.toJSON());
  }

  async findPendingRequest(infoPersonId: number): Promise<RequestEntity | null> {
    const request = await RequestModel.findOne({
      where: {
        info_person_id: infoPersonId,
        status: "requested"
      }
    });

    if (!request) return null;

    return RequestMapper.toDomain(request.toJSON());
  }


  // Busca las solicitudes por ID de persona
  async findByInfoPersonId(infoPersonId: number): Promise<RequestEntity[]> {
    const requests = await RequestModel.findAll({
      where: { 
          info_person_id: infoPersonId, // Primer filtro (AND)
          status: {                     // Segundo filtro (status)
            [Op.in]: ['accepted', 'finished'] // Operador IN con un Array de valores
          }
        },
      include: [
        {
          model: ImplementModel,
          include:[
            {
              model: ImgModel
            },
            {
              model: GroupImplementModel
            }
          ]
        },
      ]
    });

    return requests.map((request) => RequestMapper.toDomain(request.toJSON()));
  }

  // Busca la solicitud por estado prestado y ID de persona
  // Me debe mostrar el implemento que tengo prestado
  async findByStatusByInfoPersonId(infoPersonId: number): Promise<RequestEntity | null> {
    const request = await RequestModel.findOne({
      where: { 
        // 1. Filtro por Persona
        info_person_id: infoPersonId, 
        
        // 2. Filtro de Estado de la SOLICITUD
        // La solicitud debe estar ACEPTADA.
        status: 'accepted' 
      },
      include: [
        {
          // 3. Filtro de Estado del IMPLEMENTO
          // El implemento debe estar PRESTADO.
          where: { 
            status: 'borrowed' 
          },
          // 4. Aseguramos un INNER JOIN (es decir, el implemento DEBE cumplir la condición)
          required: true,
          model: ImplementModel,
          include: [
            {
              model: ImgModel
            },
            {
              model: GroupImplementModel
            }
          ]
        }
      ]
    });

    if(!request){
      return null;
    }

    return RequestMapper.toDomain(request.toJSON());
  }

  // Crea la solicitud por el administrador
  async save(requestEntity: RequestEntity): Promise<RequestEntity> {
    const requestData = RequestMapper.toPersistence(requestEntity);
    const createdRequest = await RequestModel.create(requestData);
    return RequestMapper.toDomain(createdRequest.toJSON());
  }

  // Debería actualizar status, created_at, finished_at
  async updateStatus(
      id: number,
      requestEntity: Partial<RequestEntity>,
      t: Transaction
  ): Promise<RequestEntity> {
      // 1. Convertir la entidad de dominio parcial a un objeto de persistencia.
      const requestData = RequestMapper.toPersistence(requestEntity);

      // 2. Ejecutar la actualización en la base de datos.
      const [affectedCount] = await RequestModel.update(requestData, {
          where: { id: id },
          transaction: t
      });

      // Opcional: Manejar el caso donde el ID no existe
      if (affectedCount === 0) {
          // Podrías lanzar un error si la solicitud no se encuentra
          throw new Error(`Request with ID ${id} not found.`); 
      }

      // 3. RECUPERAR la entidad recién actualizada de la base de datos.
      const updatedModel = await RequestModel.findByPk(id);

      if (!updatedModel) {
          // Esto solo debería pasar si la actualización fue correcta y luego se borró (muy improbable)
          throw new Error(`Request with ID ${id} disappeared after update.`);
      }

      // 4. Convertir el modelo de Sequelize (que tiene los datos actualizados, incluyendo updated_at) 
      // a la entidad de dominio y devolverla.
      return RequestMapper.toDomain(updatedModel.toJSON());
  }

  async delete(id: number): Promise<void> {
    await RequestModel.destroy({
      where: { id },
    });
  }
}