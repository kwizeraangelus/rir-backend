// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    requireTLS: true,
    family: 4,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  constructor() {
    console.log('=== Mail Transporter Config ===');
    console.log({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      passLength: process.env.MAIL_PASS?.length,
      mailFrom: process.env.MAIL_FROM,
    });
    console.log('=============================');
  }

  async sendPasswordReset(
    to: string,
    name: string,
    resetUrl: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"RIRI Platform" <${process.env.MAIL_FROM}>`,
      to,
      subject: 'Reset your RIRI password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #050A14; padding: 24px; text-align: center;">
            <h1 style="color: #FFD700; margin: 0; font-size: 2rem; font-style: italic;">RIRI</h1>
          </div>
          <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <h2 style="color: #050A14;">Hello ${name},</h2>
            <p style="color: #374151; line-height: 1.6;">
              We received a request to reset your password. Click the button below to choose a new one.
              This link expires in <strong>1 hour</strong>.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}"
                 style="background: #FFD700; color: #050A14; padding: 14px 32px;
                        border-radius: 9999px; text-decoration: none; font-weight: bold;
                        font-size: 1rem; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 0.875rem;">
              If you didn't request this, you can safely ignore this email. Your password won't change.
            </p>
            <p style="color: #9ca3af; font-size: 0.75rem; word-break: break-all;">
              Or copy this link: ${resetUrl}
            </p>
          </div>
          <div style="background: #050A14; padding: 16px; text-align: center;">
            <p style="color: #9ca3af; font-size: 0.75rem; margin: 0;">
              © 2025 RIRI •  Discover and Innovate for Inspire
            </p>
          </div>
        </div>
      `,
    });
  }

  // ── NEW: contact form notification ──
  async sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #050A14; padding: 24px; text-align: center;">
        <h1 style="color: #FFD700; margin: 0; font-size: 2rem; font-style: italic;">RIRI</h1>
      </div>
      <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
        <h2 style="color: #050A14; margin-top: 0;">New Contact Message</h2>
        <p style="color: #374151;"><strong>Name:</strong> ${data.name}</p>
        <p style="color: #374151;"><strong>Email:</strong> ${data.email}</p>
        <p style="color: #374151;"><strong>Subject:</strong> ${data.subject}</p>
        <p style="color: #374151;"><strong>Message:</strong></p>
        <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
      <div style="background: #050A14; padding: 16px; text-align: center;">
        <p style="color: #9ca3af; font-size: 0.75rem; margin: 0;">
          © 2025 RIRI •  Discover and Innovate for Inspire
        </p>
      </div>
    </div>
  `;

  // Send to Gmail
  await this.transporter.sendMail({
    from: `"RIRI Website" <${process.env.MAIL_FROM}>`,
    to: process.env.MAIL_USER,
    replyTo: data.email,
    subject: `[Contact Form] ${data.subject}`,
    html,
  });

  // Send to Hostinger email using separate transporter
  const hostingerTransporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_EMAIL_PASS,
    },
  });

  await hostingerTransporter.sendMail({
    from: `"RIRI Website" <${process.env.HOSTINGER_EMAIL}>`,
    to: process.env.HOSTINGER_EMAIL,
    replyTo: data.email,
    subject: `[Contact Form] ${data.subject}`,
    html,
  });
}

async sendReply(to: string, name: string, reply: string): Promise<void> {
  await this.transporter.sendMail({
    from: `"RIRI Team" <${process.env.MAIL_FROM}>`,
    to,
    subject: `Re: Your message to RIRI`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #050A14; padding: 24px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0; font-size: 2rem;">RIRI</h1>
        </div>
        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151;">Dear ${name},</p>
          <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${reply}</p>
          <p style="color: #374151; margin-top: 24px;">Best regards,<br/>RIRI Team</p>
        </div>
        <div style="background: #050A14; padding: 16px; text-align: center;">
          <p style="color: #9ca3af; font-size: 0.75rem; margin: 0;">© 2025 RIRI •  Discover and Innovate for Inspire</p>
        </div>
      </div>
    `,
    });
  }

  async sendVerificationEmail(to: string, name: string, verifyUrl: string): Promise<void> {
  await this.transporter.sendMail({
    from: `"RIRI Platform" <${process.env.MAIL_FROM}>`,
    to,
    subject: 'Verify your RIRI account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #050A14; padding: 24px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0; font-size: 2rem; font-style: italic;">RIRI</h1>
        </div>
        <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="color: #050A14;">Hello ${name},</h2>
          <p style="color: #374151; line-height: 1.6;">
            Thanks for signing up. Please confirm your email address to activate your account.
            This link expires in <strong>24 hours</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}"
               style="background: #FFD700; color: #050A14; padding: 14px 32px;
                      border-radius: 9999px; text-decoration: none; font-weight: bold;
                      font-size: 1rem; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem;">
            If you didn't create an account with RIRI, you can safely ignore this email.
          </p>
          <p style="color: #9ca3af; font-size: 0.75rem; word-break: break-all;">
            Or copy this link: ${verifyUrl}
          </p>
        </div>
        <div style="background: #050A14; padding: 16px; text-align: center;">
          <p style="color: #9ca3af; font-size: 0.75rem; margin: 0;">
            © 2025 RIRI •  Discover and Innovate for Inspire
          </p>
        </div>
      </div>
    `,
  });
}
}
