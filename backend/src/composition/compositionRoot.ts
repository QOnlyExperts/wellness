import {
  IImplementRepositoryToken,
  IImplementCounterPortToken,
  IGroupImplementRepositoryToken,
  ICategoryRepositoryToken,
  IRoleRepositoryToken 
} from './injectionTokens';

import { IImplementRepository } from '../domain/interfaces/IImplementRepository';
import { IGroupImplementRepository } from '../domain/interfaces/IGroupImplementRepository';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';
import { IRoleRepository } from '../domain/interfaces/IRoleRepository';
import { IImplementCounterPort } from '../application/ports/IImplementCounterPort';
import { SequelizeImplementCounterAdapter } from '../infrastructure/adapters/SequelizeImplementCounterAdapter';
import { SequelizeGroupImplementRepository } from '../infrastructure/repositories/SequelizeGroupImplementRepository';
import { SequelizeImplementRepository } from '../infrastructure/repositories/SequelizeImplementRepository';
import { SequelizeCategoryRepository } from '../infrastructure/repositories/SequelizeCategoryRepository';
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
// Importaciones de Casos de Uso (Category)
import { CreateCategory } from '../application/use-cases/category/CreateCategory';
import { GetCategories } from '../application/use-cases/category/GetCategories';
import { UpdateCategory } from '../application/use-cases/category/UpdateCategory';
import { GetCategoryById } from '../application/use-cases/category/GetCategoryById';
// Importaciones de Casos de Uso (Role)
import { CreateRole } from "../application/use-cases/roles/CreateRole";
import { GetRoles } from "../application/use-cases/roles/GetRoles";
import { GetRoleById } from "../application/use-cases/roles/GetRoleById";
import { UpdateRole } from "../application/use-cases/roles/UpdateRole";


// EL MAPEO CENTRALIZADO (Inversión Genérica)
export const Dependencies = {
    [IImplementRepositoryToken]: new SequelizeImplementRepository(),
    [IImplementCounterPortToken]: new SequelizeImplementCounterAdapter(),
    [IGroupImplementRepositoryToken]: new SequelizeGroupImplementRepository(),
    [ICategoryRepositoryToken]: new SequelizeCategoryRepository(),
    [IRoleRepositoryToken]: new SequelizeRoleRepository(), // <-- Usa el Symbol como clave
};

// --- RESOLVERS ---

// Implement Resolvers
export function resolveCreateImplementUseCase(): CreateImplement {
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    const implementCounterPort = Dependencies[IImplementCounterPortToken] as IImplementCounterPort;
    return new CreateImplement(implementRepository, implementCounterPort);
}
export function resolveGetImplementsUseCase(): GetImplements {
    const implementRepository = Dependencies[IImplementRepositoryToken] as IImplementRepository;
    return new GetImplements(implementRepository);
}

// GroupImplement Resolvers
export function resolveCreateGroupImplementUseCase(): CreateGroupImplement {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    return new CreateGroupImplement(groupImplementRepository);
}
export function resolveGetGroupImplementsUseCase(): GetGroupImplements {
    const groupImplementRepository = Dependencies[IGroupImplementRepositoryToken] as IGroupImplementRepository;
    return new GetGroupImplements(groupImplementRepository);
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