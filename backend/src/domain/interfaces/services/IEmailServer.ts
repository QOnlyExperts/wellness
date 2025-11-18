
export interface IEmailService {
  sendVerification(email: string): Promise<void>;
  sendPasswordReset(email: string, token: string): Promise<void>;
}
