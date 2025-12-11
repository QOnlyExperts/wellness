// Se usa Symbol.for() para crear un Symbol que puede ser usado globalmente
export const IImplementRepositoryToken = Symbol.for('IImplementRepository');
export const IImplementGetByIdUseCaseToken = Symbol.for('IImplementGetByIdUseCase');
export const IImgRepositoryToken = Symbol.for('IImgRepository');
export const IImplementCounterPortToken = Symbol.for('IImplementCounterPort');
export const IGroupImplementRepositoryToken = Symbol.for('IGroupImplementRepository');
export const ICategoryRepositoryToken = Symbol.for('ICategoryRepository');

export const ImgServiceToken = Symbol.for('ImgService');
export const IRoleRepositoryToken = Symbol.for('IRoleRepository');

export const IUserRepositoryToken = Symbol.for('IUserRepository');
export const IInfoPersonRepositoryToken = Symbol.for('IInfoPersonRepository');

export const IUserCreatorToken = Symbol.for('IUserCreator');

export const IInfoPersonCreatorToken = Symbol.for('IInfoPersonCreator');
export const IInfoPersonGetByIdUserUseCaseToken = Symbol.for('IInfoPersonGetByIdUserUseCase');

export const IRequestRepositoryToken = Symbol.for('IRequestRepository');
export const IRequestCreatorToken = Symbol.for('IRequestCreator');
export const IRequestUpdateUseCaseToken = Symbol.for('IRequestUpdateUseCase');
export const IImplementCreatorToken = Symbol.for('IImplementCreator');
export const IImplementUpdateStatusUseCaseToken = Symbol.for('IImplementUpdateStatusUseCase');

export const IHashServiceToken = Symbol.for('IHashService');
export const IEmailServiceToken = Symbol.for('IEmailService');
export const IJwtServiceToken = Symbol.for('IJwtService');
export const IProgramRepositoryToken = Symbol.for('IProgramRepository');
