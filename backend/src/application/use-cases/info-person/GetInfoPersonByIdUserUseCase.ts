import { InfoPersonEntity } from "../../../domain/entities/InfoPersonEntity";
import { IInfoPersonRepository } from "../../../domain/interfaces/IInfoPersonRepository";
import { NotFoundError } from "../../../shared/errors/DomainErrors";
import { InfoPersonOutputDto } from "../../dtos/info-person/InfoPersonOutputDto";
import { InfoPersonMapper } from "../../mappers/InfoPersonMapper";


export class GetInfoPersonByIdUserUseCase  {
  constructor(
    private infoPersonRepository: IInfoPersonRepository
  ) {}

  public async execute(
    id: number,
  ): Promise<InfoPersonOutputDto> {

    const infoPerson: InfoPersonEntity | null = await this.infoPersonRepository.findByIdUser(id);
    if (!infoPerson || !infoPerson.id) {
      throw new NotFoundError('Información de persona');
    }

    return InfoPersonMapper.toOutputDto(infoPerson);
  }

}