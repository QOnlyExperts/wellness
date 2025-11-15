import { GetPhoneById } from "../../../../src/application/use-cases/phones/GetPhoneById";
import { IPhoneRepository } from "../../../../src/domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../../../src/domain/entities/PhoneEntity";
import { PhoneMapper } from "../../../../src/application/mappers/PhoneMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: GetPhoneById", () => {
  let mockRepository: jest.Mocked<IPhoneRepository>;
  let getPhoneById: GetPhoneById;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IPhoneRepository>;
    
    getPhoneById = new GetPhoneById(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería devolver un DTO de teléfono si el ID existe", async () => {
    // Arrange
    const entity = PhoneEntity.create({ id: 1, number: BigInt("123"), info_person_id: 1 });
    mockRepository.findById.mockResolvedValue(entity);

    // Act
    const result = await getPhoneById.execute(1);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(PhoneMapper.toOutputDto(entity));
  });

  // Test 2: Caso ID no encontrado
  it("debería lanzar NotFoundError si el ID no se encuentra", async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getPhoneById.execute(999)).rejects.toThrow(NotFoundError);
  });

  // Test 3: Caso ID inválido
  it("debería lanzar ValidationError si el ID es 0 o negativo", async () => {
    // Act & Assert
    await expect(getPhoneById.execute(0)).rejects.toThrow(ValidationError);
    expect(mockRepository.findById).not.toHaveBeenCalled();
  });
});