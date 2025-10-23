// -- src/composition/compositionRoot.ts --

// Importaciones del NÚCLEO (Interfaces, Casos de Uso)
// Symbols para inyección
import { IImplementRepositoryToken, IImplementCounterPortToken, IImgRepositoryToken, ImgServiceToken, IGroupImplementRepositoryToken, ICategoryRepositoryToken } from './injectionTokens';

import { IImplementRepository } from '../domain/interfaces/IImplementRepository';
import { IGroupImplementRepository } from '../domain/interfaces/IGroupImplementRepository';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';
import { IImplementCounterPort } from '../application/ports/IImplementCounterPort';
import { IImgRepository } from '../domain/interfaces/IImgRepository';
import { SequelizeImplementCounterAdapter } from '../infrastructure/adapters/SequelizeImplementCounterAdapter';


import { SequelizeGroupImplementRepository } from '../infrastructure/repositories/SequelizeGroupImplementRepository';
import { CreateGroupImplement } from '../application/use-cases/group-implements/CreateGroupImplement';
import { GetGroupImplements } from '../application/use-cases/group-implements/GetGroupImplements';
import { GetGroupImplementById } from '../application/use-cases/group-implements/GetGroupImplementById';
import { UpdateGroupImplement } from '../application/use-cases/group-implements/UpdateGroupImplement';
import { GetGroupImplementBySearch } from '../application/use-cases/group-implements/GetGroupImplementBySearch';
// Importaciones de INFRAESTRUCTURA (Implementaciones concretas)
import { SequelizeImplementRepository } from '../infrastructure/repositories/SequelizeImplementRepository';
import { CreateImplement } from '../application/use-cases/implements/CreateImplement';
import { GetImplements } from '../application/use-cases/implements/GetImplements';
import { GetImplementByIdGroup } from '../application/use-cases/implements/GetImplementByIdGroup';

import { SequelizeImgRepository } from '../infrastructure/repositories/SequelizeImgRepository';
// import { ThirdPartyApiService } from '../infrastructure/services/ThirdPartyApiService';

import { SequelizeCategoryRepository } from '../infrastructure/repositories/SequelizeCategoryRepository';
import { CreateCategory } from '../application/use-cases/category/CreateCategory';
import { GetCategories } from '../application/use-cases/category/GetCategories';
import { UpdateCategory } from '../application/use-cases/category/UpdateCategory';
import { GetCategoryById } from '../application/use-cases/category/GetCategoryById';
import { ImgService } from '../application/services/ImgService';

// Se crea un Symbol para la inyección
export const IImplementRepositorySymbol = Symbol.for('IImplementRepository');

// EL MAPEO CENTRALIZADO (Inversión Genérica)
export const Dependencies = {
    // Usamos el string 'IImplementRepository' como la clave
    [IImplementRepositoryToken]: new SequelizeImplementRepository(),
    [IImgRepositoryToken]: new SequelizeImgRepository(),
    [IImplementCounterPortToken]: new SequelizeImplementCounterAdapter(),
    [IGroupImplementRepositoryToken]: new SequelizeGroupImplementRepository(),
    [ICategoryRepositoryToken]: new SequelizeCategoryRepository(),
    [ImgServiceToken]: new ImgService()
};

// 2. FUNCIÓN DE RESOLUCIÓN
export function resolveCreateImplementUseCase(): CreateImplement {
    // Obtenemos la implementación usando el mismo token string
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    const implementCounterPort = Dependencies[IImplementCounterPortToken] as IImplementCounterPort;
    const imgRepository = Dependencies[IImgRepositoryToken] as IImgRepository;
    const imgService = Dependencies[ImgServiceToken] as ImgService;

    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new CreateImplement(
        implementRepository,
        implementCounterPort,
        imgRepository,
        imgService
    );
}

export function resolveGetImplementsUseCase(): GetImplements {
    // Obtenemos la implementación usando el mismo token string
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;

    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetImplements(implementRepository);
}


export function resolveGetImplementByIdGroup(): GetImplementByIdGroup {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;

    return new GetImplementByIdGroup(
        groupImplementRepository,
        implementRepository
    );
}

export function resolveCreateGroupImplementUseCase(): CreateGroupImplement {
    // Obtenemos la implementación usando el mismo token string
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new CreateGroupImplement(
        groupImplementRepository
    );
}


export function resolveGetGroupImplementsUseCase(): GetGroupImplements {
    // Obtenemos la implementación usando el mismo token string
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetGroupImplements(groupImplementRepository);
}

export function resolveGetGroupImplementByIdUseCase(): GetGroupImplementById {
    // Obtenemos la implementación usando el mismo token string
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetGroupImplementById(groupImplementRepository);
}

export function resolveUpdateGroupImplementUseCase(): UpdateGroupImplement {
    // Obtenemos la implementación usando el mismo token string
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new UpdateGroupImplement(groupImplementRepository);
}

export function resolveGetGroupImplementBySearchUseCase(): GetGroupImplementBySearch {
    // Obtenemos la implementación usando el mismo token string
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetGroupImplementBySearch(groupImplementRepository);
}

export function resolveCreateCategoryUseCase(): CreateCategory {
    // Obtenemos la implementación usando el mismo token string
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new CreateCategory(categoryRepository);
}

export function resolveGetCategoriesUseCase(): GetCategories {
    // Obtenemos la implementación usando el mismo token string
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetCategories(categoryRepository);
}

export function resolveUpdateCategoryUseCase(): UpdateCategory {
    // Obtenemos la implementación usando el mismo token string
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new UpdateCategory(categoryRepository);
}

export function resolveGetCategoryByIdUseCase(): GetCategoryById {
    // Obtenemos la implementación usando el mismo token string
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetCategoryById(categoryRepository);
}
