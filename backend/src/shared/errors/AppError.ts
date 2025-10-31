export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: string;

  constructor(message: string, statusCode = 500, type = "AppError") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    Object.setPrototypeOf(this, new.target.prototype); // Fija el prototipo correctamente
  }
}
