import { GetPhonesByInfoPersonId } from "../../../../src/application/use-cases/phones/GetPhonesByInfoPersonId";
import { IPhoneRepository } from "../../../../src/domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../../../src/domain/entities/PhoneEntity";
import { PhoneMapper } from "../../../../src/application/mappers/PhoneMapper";
import { ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetPhonesByInfoPersonId", () => {
  let mockRepository: jest.Mocked<IPhoneRepository>;
  let getPhonesByInfoPersonId: GetPhonesByInfoPersonId;

  beforeEach(() => {
    mockRepository = {
      findByInfoPersonId: jest.fn(),
    } as unknown as jest.Mocked<IPhoneRepository>;
    
    getPhonesByInfoPersonId = new GetPhonesByInfoPersonId(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería devolver una lista de teléfonos para una persona", async () => {
    // Arrange
    const entities: PhoneEntity[] = [
      PhoneEntity.create({ id: 1, number: BigInt("123"), info_person_id: 5 }),
    ];
    mockRepository.findByInfoPersonId.mockResolvedValue(entities);

    // Act
    const result = await getPhonesByInfoPersonId.execute(5);

    // Assert
    expect(mockRepository.findByInfoPersonId).toHaveBeenCalledWith(5);
    expect(result).toEqual(entities.map(PhoneMapper.toOutputDto));
  });

  // Test 2: Caso ID inválido
  it("debería lanzar ValidationError si el ID de la persona es 0 o negativo", async () => {
    // Act & Assert
    await expect(getPhonesByInfoPersonId.execute(0)).rejects.toThrow(ValidationError);
    expect(mockRepository.findByInfoPersonId).not.toHaveBeenCalled();
  });
});