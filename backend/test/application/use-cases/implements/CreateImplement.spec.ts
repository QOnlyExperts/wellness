
import { CreateImplement } from '../../../../src/application/use-cases/implements/CreateImplement';
import { IImplementRepository } from '../../../../src/domain/interfaces/IImplementRepository';
import { IImplementCounterPort } from '../../../../src/application/ports/IImplementCounterPort';
import { ImplementEntity } from '../../../../src/domain/entities/ImplementEntity';
import { ImplementStatus } from '../../../../src/domain/enums/ImplementStatus';
import { ImplementCondition } from '../../../../src/domain/enums/ImplementCondition';

describe('CreateImplement Use Case', () => {
  let mockRepository: jest.Mocked<IImplementRepository>;
  let mockCounter: jest.Mocked<IImplementCounterPort>;
  let createImplement: CreateImplement;

  beforeEach(() => {
    // Mocks vacíos que luego configuramos en cada test
    mockRepository = {
      save: jest.fn(),
    } as any;

    mockCounter = {
      getNextNumber: jest.fn(),
    } as any;

    createImplement = new CreateImplement(mockRepository, mockCounter);
  });

  it('debería crear un implemento con código formateado y valores por defecto', async () => {
    // Arrange
    const input = {
      prefix: 'IMP',
      group_implement_id: 1,
      categories_id: 2,
      status: ImplementStatus.AVAILABLE,
      condition: ImplementCondition.NEW,
    };

    // Mock: el contador devuelve 5
    mockCounter.getNextNumber.mockResolvedValue(5);

    // Mock: el repositorio devuelve el implemento guardado
    const expectedEntity = new ImplementEntity(
      1,
      'IMP005',
      ImplementStatus.AVAILABLE,
      ImplementCondition.NEW,
      1,
      2
    );
    mockRepository.save.mockResolvedValue(expectedEntity);

    // Act
    const result = await createImplement.execute(input);

    // Assert
    expect(mockCounter.getNextNumber).toHaveBeenCalledWith('IMP');
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        cod: 'IMP005',
        status: ImplementStatus.AVAILABLE,
        condition: ImplementCondition.NEW,
        group_implement_id: 1,
        categories_id: 2,
      })
    );
    expect(result).toEqual(expectedEntity);
  });

  it('debería lanzar error si el contador devuelve valor inválido', async () => {
    mockCounter.getNextNumber.mockResolvedValue(undefined);

    await expect(
      createImplement.execute({
        prefix: 'IMP',
        status: ImplementStatus.AVAILABLE,
        condition: ImplementCondition.NEW,
        group_implement_id: 1,
        categories_id: 2
      })
    ).rejects.toThrow('Invalid counter value');

    // Verificamos que se haya llamado correctamente con el prefijo
    expect(mockCounter.getNextNumber).toHaveBeenCalledWith('IMP');
  });
});
