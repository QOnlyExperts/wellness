import { UpdatePhone } from "../../../../src/application/use-cases/phones/UpdatePhone";
import { IPhoneRepository } from "../../../../src/domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../../../src/domain/entities/PhoneEntity";
import { PhoneMapper } from "../../../../src/application/mappers/PhoneMapper";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: UpdatePhone", () => {
  let mockRepository: jest.Mocked<IPhoneRepository>;
  let updatePhone: UpdatePhone;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByNumber: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IPhoneRepository>;
    
    updatePhone = new UpdatePhone(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería actualizar un teléfono y devolver el DTO", async () => {
    // Arrange
    const existingEntity = PhoneEntity.create({ id: 1, number: BigInt("123"), info_person_id: 1 });
    const input = { number: BigInt("456") }; // Datos para actualizar
    
    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByNumber.mockResolvedValue(null); // El nuevo número no existe
    
    const updatedEntity = PhoneEntity.create({ ...existingEntity, ...input });
    mockRepository.save.mockResolvedValue(updatedEntity);

    // Act
    const result = await updatePhone.execute(1, input);

    // Assert
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.findByNumber).toHaveBeenCalledWith(input.number);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(PhoneMapper.toOutputDto(updatedEntity));
  });

  // Test 2: Caso ID no encontrado
  it("debería lanzar NotFoundError si el teléfono a actualizar no existe", async () => {
    // Arrange
    mockRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updatePhone.execute(999, { number: BigInt("111") })).rejects.toThrow(NotFoundError);
  });

  // Test 3: Caso Número duplicado
  it("debería lanzar ValidationError si el nuevo número ya pertenece a otro teléfono", async () => {
    // Arrange
    const existingEntity = PhoneEntity.create({ id: 1, number: BigInt("123"), info_person_id: 1 });
    const conflictingEntity = PhoneEntity.create({ id: 2, number: BigInt("456"), info_person_id: 2 });
    
    mockRepository.findById.mockResolvedValue(existingEntity);
    mockRepository.findByNumber.mockResolvedValue(conflictingEntity); // El número "456" ya existe en el ID 2

    // Act & Assert
    await expect(updatePhone.execute(1, { number: BigInt("456") })).rejects.toThrow(ValidationError);
  });
});