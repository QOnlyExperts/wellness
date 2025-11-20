
import { RequestEntity } from "../../domain/entities/RequestEntity";
import { IRequestRepository } from "../../domain/interfaces/IRequestRepository";
import { ImplementModel, InfoPersonModel, RequestModel } from "../models/indexModel";
import { RequestMapper } from "../../application/mappers/RequestMapper";

export class SequelizeRequestRepository implements IRequestRepository {
  async findAll(): Promise<RequestEntity[]> {
    const requests = await RequestModel.findAll({
      include: [
        {
          model: InfoPersonModel,
        },
        {
          model: ImplementModel,
        },
      ],
    });
    console.log(JSON.stringify(requests));
    return requests.map((request) => RequestMapper.toDomain(request.toJSON()));
  }

  async findById(id: number): Promise<RequestEntity | null> {
    const request = await RequestModel.findByPk(id);
    if (!request) {
      return null;
    }
    return RequestMapper.toDomain(request.toJSON());
  }

  // Busca las solicitudes por ID de persona
  async findByInfoPersonId(infoPersonId: number): Promise<RequestEntity[]> {
    const requests = await RequestModel.findAll({
      where: { info_person_id: infoPersonId },
    });
    return requests.map((request) => RequestMapper.toDomain(request.toJSON()));
  }

  // Busca la solicitud por estado prestado y ID de persona
  // Me debe mostrar el implemento que tengo prestado
  async findByStatusByInfoPersonId(infoPersonId: number): Promise<RequestEntity | null> {
    const request = await RequestModel.findOne({
      where: { 
        info_person_id: infoPersonId, 
        status: 'borrowed' 
      },
      include:[
        {
          model: ImplementModel
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
    requestEntity: Partial<RequestEntity>
  ): Promise<RequestEntity> {

    const requestData = RequestMapper.toPersistence(requestEntity);
    await RequestModel.update(requestData, {
      where: { id: id },
    });

    return RequestMapper.toDomain(requestData.toJSON());
  }

  async delete(id: number): Promise<void> {
    await RequestModel.destroy({
      where: { id },
    });
  }
}