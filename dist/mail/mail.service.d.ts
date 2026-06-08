export declare class MailService {
    private transporter;
    sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void>;
}
