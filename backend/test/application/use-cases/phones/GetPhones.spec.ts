import { GetPhones } from "../../../../src/application/use-cases/phones/GetPhones";
import { IPhoneRepository } from "../../../../src/domain/interfaces/IPhoneRepository";
import { PhoneEntity } from "../../../../src/domain/entities/PhoneEntity";
import { PhoneMapper } from "../../../../src/application/mappers/PhoneMapper";

describe("Caso de uso: GetPhones", () => {
  let mockRepository: jest.Mocked<IPhoneRepository>;
  let getPhones: GetPhones;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IPhoneRepository>;
    
    getPhones = new GetPhones(mockRepository);
  });

  // Test 1: Caso exitoso con datos
  it("debería retornar una lista de PhoneOutputDto", async () => {
    // Arrange
    const entities: PhoneEntity[] = [
      PhoneEntity.create({ id: 1, number: BigInt("123"), info_person_id: 1 }),
      PhoneEntity.create({ id: 2, number: BigInt("456"), info_person_id: 2 }),
    ];
    mockRepository.findAll.mockResolvedValue(entities);

    // Act
    const result = await getPhones.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(entities.map(PhoneMapper.toOutputDto));
  });

  // Test 2: Caso exitoso sin datos
  it("debería retornar un arreglo vacío cuando no hay entidades", async () => {
    // Arrange
    mockRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await getPhones.execute();

    // Assert
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});