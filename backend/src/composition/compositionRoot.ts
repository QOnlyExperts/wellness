// -- src/composition/compositionRoot.ts --

// Importaciones del NÚCLEO (Interfaces, Casos de Uso)
// Symbols para inyección
import { IImplementRepositoryToken, IImplementCounterPortToken, IGroupImplementRepositoryToken } from './injectionTokens';

import { IImplementRepository } from '../domain/interfaces/IImplementRepository';
import { IGroupImplementRepository } from '../domain/interfaces/IGroupImplementRepository';
import { IImplementCounterPort } from '../application/ports/IImplementCounterPort';
import { SequelizeImplementCounterAdapter } from '../infrastructure/adapters/SequelizeImplementCounterAdapter';


import { SequelizeGroupImplementRepository } from '../infrastructure/repositories/SequelizeGroupImplementRepository';
import { CreateGroupImplement } from '../application/use-cases/group-implements/CreateGroupImplement';
// Importaciones de INFRAESTRUCTURA (Implementaciones concretas)
import { SequelizeImplementRepository } from '../infrastructure/repositories/SequelizeImplementRepository';
import { CreateImplement } from '../application/use-cases/implements/CreateImplement';
import { GetImplements } from '../application/use-cases/implements/GetImplements';
// import { ThirdPartyApiService } from '../infrastructure/services/ThirdPartyApiService';

// Se crea un Symbol para la inyección
export const IImplementRepositorySymbol = Symbol.for('IImplementRepository');

// EL MAPEO CENTRALIZADO (Inversión Genérica)
export const Dependencies = {
    // Usamos el string 'IImplementRepository' como la clave
    [IImplementRepositoryToken]: new SequelizeImplementRepository(),
    [IImplementCounterPortToken]: new SequelizeImplementCounterAdapter(),
    [IGroupImplementRepositoryToken]: new SequelizeGroupImplementRepository(),
};

// 2. FUNCIÓN DE RESOLUCIÓN
export function resolveCreateImplementUseCase(): CreateImplement {
    // Obtenemos la implementación usando el mismo token string
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    const implementCounterPort = Dependencies[IImplementCounterPortToken] as IImplementCounterPort;
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;

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


export function resolveCreateGroupImplementUseCase(): CreateGroupImplement {
    // Obtenemos la implementación usando el mismo token string
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new CreateGroupImplement(
        groupImplementRepository
    );
}