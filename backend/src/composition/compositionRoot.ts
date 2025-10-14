// -- src/composition/compositionRoot.ts --

// Importaciones del NÚCLEO (Interfaces, Casos de Uso)
// Symbols para inyección
import { IImplementRepositoryToken, IImplementCounterPortToken } from './injectionTokens';

import { IImplementRepository } from '../domain/interfaces/IImplementRepository';
import { IImplementCounterPort } from '../application/ports/IImplementCounterPort';
import { SequelizeImplementCounterAdapter } from '../infrastructure/adapters/SequelizeImplementCounterAdapter';
import { CreateImplement } from '../application/use-cases/implements/CreateImplement';

// Importaciones de INFRAESTRUCTURA (Implementaciones concretas)
import { SequelizeImplementRepository } from '../infrastructure/repositories/SequelizeImplementRepository';
import { GetImplements } from '../application/use-cases/implements/GetImplements';
// import { ThirdPartyApiService } from '../infrastructure/services/ThirdPartyApiService';

// Se crea un Symbol para la inyección
export const IImplementRepositorySymbol = Symbol.for('IImplementRepository');

// EL MAPEO CENTRALIZADO (Inversión Genérica)
export const Dependencies = {
    // Usamos el string 'IImplementRepository' como la clave
    [IImplementRepositoryToken]: new SequelizeImplementRepository(),
    [IImplementCounterPortToken]: new SequelizeImplementCounterAdapter(),
};

// 2. FUNCIÓN DE RESOLUCIÓN
export function resolveCreateImplementUseCase(): CreateImplement {
    // Obtenemos la implementación usando el mismo token string
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    const implementCounterPort = Dependencies[IImplementCounterPortToken] as IImplementCounterPort;

    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new CreateImplement(
        implementRepository,
        implementCounterPort
    );
}

export function resolveGetImplementsUseCase(): GetImplements {
    // Obtenemos la implementación usando el mismo token string
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;

    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetImplements(implementRepository);
}
