
import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/interfaces/services/EmailServer";

export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true si usas el puerto 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerification(email: string): Promise<void> {
    const link = `${process.env.APP_URL}/verify?email=${encodeURIComponent(email)}`;

    await this.transporter.sendMail({
      from: `"Soporte" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verifica tu cuenta",
      html: `
        <h2>Bienvenido</h2>
        <p>Por favor verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${link}">${link}</a>
      `,
    });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const link = `${process.env.APP_URL}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Soporte" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Restablece tu contraseña",
      html: `
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${link}">${link}</a>
      `,
    });
  }
}
