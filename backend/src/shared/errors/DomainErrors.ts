import { AppError } from "./AppError";

export class DuplicateNameError extends AppError {
  constructor(name: string) {
    super(`El nombre '${name}' ya está en uso.`, 409, "DuplicateNameError");
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} no encontrado.`, 404, "NotFoundError");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "ValidationError");
  }
}

export class DomainError extends AppError {
  constructor(message: string = "Error interno del dominio") {
    super(message, 500, "DomainError");
  }
}