import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      rol: string;
      email?: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
