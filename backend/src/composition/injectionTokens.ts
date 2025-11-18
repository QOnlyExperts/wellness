// Se usa Symbol.for() para crear un Symbol que puede ser usado globalmente
export const IImplementRepositoryToken = Symbol.for('IImplementRepository');
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

export const IHashServiceToken = Symbol.for('IHashService');
export const IEmailServiceToken = Symbol.for('IEmailService');
export const IJwtServiceToken = Symbol.for('IJwtService');