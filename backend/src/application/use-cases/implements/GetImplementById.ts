import { IImplementRepository } from "../../../domain/interfaces/IImplementRepository";
import { ImplementEntity } from "../../../domain/entities/ImplementEntity";
import { ImplementInputDto } from "../../dtos/implements/ImplementInputDto";
import { ImplementOutputDto } from "../../dtos/implements/ImplementOutputDto";
import { ImplementMapper } from "../../mappers/ImplementMapper";
import { ImplementUpdateDto } from "../../dtos/implements/ImplementUpdateDto";
import { NotFoundError } from "../../../shared/errors/DomainErrors";

export class GetImplementById {
  constructor(
    private implementRepository: IImplementRepository
  ) {}

  public async execute(
    id: number,
  ): Promise<ImplementOutputDto> {

    const implement: ImplementEntity | null = await this.implementRepository.findById(id);
    if (!implement) {
      throw new NotFoundError('Implemento');
    }

    return ImplementMapper.toOutputDto(implement);
  }
}
