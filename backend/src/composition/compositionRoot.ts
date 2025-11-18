
import dotenv from 'dotenv';

dotenv.config();

const {
    SECRET_KEY
} = process.env;
// -- src/composition/compositionRoot.ts --

// Importaciones del NÚCLEO (Interfaces, Casos de Uso)
// Symbols para inyección
import { IImplementRepositoryToken, IImplementCounterPortToken, IImgRepositoryToken, ImgServiceToken, IGroupImplementRepositoryToken, ICategoryRepositoryToken, IRoleRepositoryToken, IUserRepositoryToken, IInfoPersonRepositoryToken, IUserCreatorToken, IHashServiceToken, IEmailServiceToken, IInfoPersonCreatorToken, IJwtServiceToken } from './injectionTokens';

import { IImplementRepository } from '../domain/interfaces/IImplementRepository';
import { IGroupImplementRepository } from '../domain/interfaces/IGroupImplementRepository';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';
import { IRoleRepository } from '../domain/interfaces/IRoleRepository';
import { IImplementCounterPort } from '../application/ports/IImplementCounterPort';
import { IImgRepository } from '../domain/interfaces/IImgRepository';
import { SequelizeImplementCounterAdapter } from '../infrastructure/adapters/SequelizeImplementCounterAdapter';
import { SequelizeGroupImplementRepository } from '../infrastructure/repositories/SequelizeGroupImplementRepository';
import { SequelizeImplementRepository } from '../infrastructure/repositories/SequelizeImplementRepository';
import { SequelizeRoleRepository } from '../infrastructure/repositories/SequelizeRoleRepository'; // <-- Importa el repo

// Importaciones de Casos de Uso (GroupImplement)
import { CreateGroupImplement } from '../application/use-cases/group-implements/CreateGroupImplement';
import { GetGroupImplements } from '../application/use-cases/group-implements/GetGroupImplements';
import { GetGroupImplementById } from '../application/use-cases/group-implements/GetGroupImplementById';
import { UpdateGroupImplement } from '../application/use-cases/group-implements/UpdateGroupImplement';
import { GetGroupImplementBySearch } from '../application/use-cases/group-implements/GetGroupImplementBySearch';
// Importaciones de Casos de Uso (Implement)
import { CreateImplement } from '../application/use-cases/implements/CreateImplement';
import { GetImplements } from '../application/use-cases/implements/GetImplements';
import { GetImplementByIdGroup } from '../application/use-cases/implements/GetImplementByIdGroup';
import { UpdateMultipleImplements } from '../application/use-cases/implements/UpdateMultipleImplements';
import { UpdateImplement } from '../application/use-cases/implements/UpdateImplement';
import { GetImplementByStatus } from '../application/use-cases/implements/GetImplementByStatus';

import { SequelizeImgRepository } from '../infrastructure/repositories/SequelizeImgRepository';
// import { ThirdPartyApiService } from '../infrastructure/services/ThirdPartyApiService';

import { SequelizeCategoryRepository } from '../infrastructure/repositories/SequelizeCategoryRepository';
import { CreateCategory } from '../application/use-cases/category/CreateCategory';
import { GetCategories } from '../application/use-cases/category/GetCategories';
import { UpdateCategory } from '../application/use-cases/category/UpdateCategory';
import { GetCategoryById } from '../application/use-cases/category/GetCategoryById';
import { ImgService } from '../application/services/ImgService';

// Importaciones de Casos de Uso (Role)
import { CreateRole } from "../application/use-cases/roles/CreateRole";
import { GetRoles } from "../application/use-cases/roles/GetRoles";
import { GetRoleById } from "../application/use-cases/roles/GetRoleById";
import { UpdateRole } from "../application/use-cases/roles/UpdateRole";

import { RegisterUserUseCase } from '../application/use-cases/users/register/RegisterUserUseCase';
import { SequelizeUserRepository } from '../infrastructure/repositories/SequelizeUserRepository';
import { SequelizeInfoPersonRepository } from '../infrastructure/repositories/SequelizeInfoPersonRepository';
import { CreateUserUseCase } from '../application/use-cases/users/CreateUserUseCase';
import { CreateInfoPersonUseCase } from '../application/use-cases/info-person/CreateInfoPersonUseCase';
import { HashService } from '../application/services/HashService';
import { EmailService } from '../application/services/EmailService';
import { IUserCreator } from '../domain/interfaces/IUserCreator';
import { IInfoPersonCreator } from '../domain/interfaces/IInfoPersonCreator';
import { JwtService } from '../application/services/JwtService';
import { JwkKeyExportOptions } from 'crypto';
// import {  }

// EL MAPEO CENTRALIZADO (Inversión Genérica)
export const Dependencies: Record<symbol, any> = {
    [IImplementRepositoryToken]: new SequelizeImplementRepository(),
    [IImgRepositoryToken]: new SequelizeImgRepository(),
    [IImplementCounterPortToken]: new SequelizeImplementCounterAdapter(),
    [IGroupImplementRepositoryToken]: new SequelizeGroupImplementRepository(),
    [ICategoryRepositoryToken]: new SequelizeCategoryRepository(),
    [ImgServiceToken]: new ImgService(),
    [IRoleRepositoryToken]: new SequelizeRoleRepository(),

    [IUserRepositoryToken]: new SequelizeUserRepository(),
    [IInfoPersonRepositoryToken]: new SequelizeInfoPersonRepository(),

    [IHashServiceToken]: new HashService(), // por ejemplo, 10 saltRounds
    [IEmailServiceToken]: new EmailService(),
    [IJwtServiceToken]: new JwtService(SECRET_KEY!)
};
// Caso de uso de crear usuario
Dependencies[IUserCreatorToken] = new CreateUserUseCase(
    Dependencies[IUserRepositoryToken],
);

// Caso de uso de crear usuario
Dependencies[IInfoPersonCreatorToken] = new CreateInfoPersonUseCase(
    Dependencies[IInfoPersonRepositoryToken],
);

export function resolveRegisterUserUseCase(): RegisterUserUseCase {
    const userCreator = Dependencies[IUserCreatorToken] as IUserCreator;
    const infoPersonCreator = Dependencies[IInfoPersonCreatorToken] as IInfoPersonCreator;
    const hashService = Dependencies[IHashServiceToken] as HashService;
    const emailService = Dependencies[IEmailServiceToken] as EmailService;
    const jwtService = Dependencies[IJwtServiceToken] as JwtService;
    // const infoPersonCreator = Dependencies[IInfoPersonCreatorToken];


    return new RegisterUserUseCase(
        userCreator,
        infoPersonCreator,
        hashService,
        emailService,
        jwtService
    );
}



// --- RESOLVERS ---

// Implement Resolvers
export function resolveCreateImplementUseCase(): CreateImplement {
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
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
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

export function resolveUpdateImplement(): UpdateImplement {
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    return new UpdateImplement(implementRepository);
}

export function resolveUpdateManyImplement(): UpdateMultipleImplements {
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    return new UpdateMultipleImplements(implementRepository);
}

export function resolveGetImplementByStatus(): GetImplementByStatus {
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    return new GetImplementByStatus(implementRepository);
}


export function resolveCreateGroupImplementUseCase(): CreateGroupImplement {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    return new CreateGroupImplement(groupImplementRepository);
}
export function resolveGetGroupImplementsUseCase(): GetGroupImplements {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    // Retornamos una nueva instancia del caso de uso con las dependencias inyectadas
    return new GetGroupImplements(
        groupImplementRepository,
        implementRepository
    );
}
export function resolveGetGroupImplementByIdUseCase(): GetGroupImplementById {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    return new GetGroupImplementById(groupImplementRepository);
}
export function resolveUpdateGroupImplementUseCase(): UpdateGroupImplement {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    return new UpdateGroupImplement(groupImplementRepository);
}
export function resolveGetGroupImplementBySearchUseCase(): GetGroupImplementBySearch {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    return new GetGroupImplementBySearch(groupImplementRepository);
}

// Category Resolvers
export function resolveCreateCategoryUseCase(): CreateCategory {
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    return new CreateCategory(categoryRepository);
}
export function resolveGetCategoriesUseCase(): GetCategories {
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    return new GetCategories(categoryRepository);
}
export function resolveUpdateCategoryUseCase(): UpdateCategory {
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    return new UpdateCategory(categoryRepository);
}
export function resolveGetCategoryByIdUseCase(): GetCategoryById {
    const categoryRepository = Dependencies[ICategoryRepositoryToken] as ICategoryRepository;
    return new GetCategoryById(categoryRepository);
}

// Role Resolvers
export function resolveCreateRoleUseCase(): CreateRole {
    const roleRepository = Dependencies[IRoleRepositoryToken] as IRoleRepository; // <-- Usa el Symbol para buscar
    return new CreateRole(roleRepository);
}
export function resolveGetRolesUseCase(): GetRoles {
    const roleRepository = Dependencies[IRoleRepositoryToken] as IRoleRepository; // <-- Usa el Symbol para buscar
    return new GetRoles(roleRepository);
}
export function resolveGetRoleByIdUseCase(): GetRoleById {
    const roleRepository = Dependencies[IRoleRepositoryToken] as IRoleRepository; // <-- Usa el Symbol para buscar
    return new GetRoleById(roleRepository);
}
export function resolveUpdateRoleUseCase(): UpdateRole {
    const roleRepository = Dependencies[IRoleRepositoryToken] as IRoleRepository; // <-- Usa el Symbol para buscar
    return new UpdateRole(roleRepository);
}