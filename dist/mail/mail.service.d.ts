export declare class MailService {
    private transporter;
    sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void>;
    sendContactNotification(data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<void>;
    sendReply(to: string, name: string, reply: string): Promise<void>;
    sendVerificationEmail(to: string, name: string, verifyUrl: string): Promise<void>;
}
