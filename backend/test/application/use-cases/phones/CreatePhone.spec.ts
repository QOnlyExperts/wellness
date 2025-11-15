import { CreatePhone } from "../../../../src/application/use-cases/phones/CreatePhone";
import { IPhoneRepository } from "../../../../src/domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../../../src/domain/entities/PhoneEntity";
import { PhoneMapper } from "../../../../src/application/mappers/PhoneMapper";
import { ValidationError } from "../../../../src/shared/errors/DomainErrors";

describe("Caso de uso: CreatePhone", () => {
  let mockRepository: jest.Mocked<IPhoneRepository>;
  let createPhone: CreatePhone;

  beforeEach(() => {
    mockRepository = {
      findByNumber: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IPhoneRepository>;
    
    createPhone = new CreatePhone(mockRepository);
  });

  // Test 1: Caso exitoso
  it("debería crear un teléfono y devolver el DTO correspondiente", async () => {
    // Arrange
    const inputNumber = BigInt("1234567890");
    const input = { number: inputNumber, info_person_id: 1 };
    
    mockRepository.findByNumber.mockResolvedValue(null); // No existe el número

    const entity = PhoneEntity.create({ id: 1, ...input });
    mockRepository.save.mockResolvedValue(entity);

    // Act
    const result = await createPhone.execute(input);

    // Assert
    expect(mockRepository.findByNumber).toHaveBeenCalledWith(inputNumber);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(PhoneMapper.toOutputDto(entity));
  });

  // Test 2: Caso de número duplicado
  it("debería lanzar ValidationError si el número de teléfono ya existe", async () => {
    // Arrange
    const inputNumber = BigInt("1234567890");
    const input = { number: inputNumber, info_person_id: 1 };
    const existingEntity = PhoneEntity.create({ id: 1, ...input });
    
    mockRepository.findByNumber.mockResolvedValue(existingEntity); // Simulamos que ya existe

    // Act & Assert
    await expect(createPhone.execute(input)).rejects.toThrow(ValidationError);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});