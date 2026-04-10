import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private config: ConfigService) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.logger.log(`Email → ${to}: ${subject}`);
    const smtpHost = this.config.get('smtp.host');
    const smtpPort = this.config.get('smtp.port');

    try {
      const smtpUser = this.config.get<string>('smtp.user', '');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: smtpUser
          ? {
              user: smtpUser,
              pass: this.config.get<string>('smtp.pass', ''),
            }
          : undefined,
      });

      await transporter.sendMail({
        from: this.config.get<string>('smtp.from', 'noreply@los-scf.com'),
        to,
        subject,
        html: body,
      });
    } catch (error: unknown) {
      this.logger.error(`Email send failed: ${(error as Error).message}`);
    }
  }

  async sendSms(mobile: string, message: string): Promise<void> {
    this.logger.log(`SMS → ${mobile}: ${message.slice(0, 50)}...`);
    const apiKey = this.config.get('sms.apiKey');
    if (!apiKey) {
      this.logger.warn('SMS API key not configured');
      return;
    }
  }

  async sendWhatsApp(mobile: string, message: string): Promise<void> {
    this.logger.log(`WhatsApp → ${mobile}: ${message.slice(0, 50)}...`);
    const apiKey = this.config.get('whatsapp.apiKey');
    if (!apiKey) {
      this.logger.warn('WhatsApp API key not configured');
      return;
    }
  }

  async notifyLeadStatusChange(
    email: string,
    mobile: string,
    borrowerName: string,
    applicationNumber: string,
    newStatus: string,
  ): Promise<void> {
    const subject = `Loan Application ${applicationNumber} - Status Update`;
    const body = `
      <h3>Dear ${borrowerName},</h3>
      <p>Your loan application <strong>${applicationNumber}</strong> status has been updated to: <strong>${newStatus}</strong>.</p>
      <p>Please log in to the portal for more details.</p>
    `;

    await Promise.allSettled([
      this.sendEmail(email, subject, body),
      this.sendSms(mobile, `LOS-SCF: Application ${applicationNumber} status: ${newStatus}`),
    ]);
  }
}
