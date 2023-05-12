import { injectable } from 'inversify';
import { google, Auth, Common, gmail_v1, GoogleApis } from 'googleapis';

@injectable()
export class MailService {
    auth: Auth.GoogleAuth
    gmail: gmail_v1.Gmail

    constructor() {
        this.auth = new google.auth.GoogleAuth({
            keyFile: `googleServiceAccountKey.json`,
            scopes: [
                `https://www.googleapis.com/auth/gmail.send`,
            ]
        })
        this.gmail = google.gmail({
            version: 'v1',
            auth: this.auth
        })
        console.log(`[MailService] Gmail service is ready`)
    }
    
    async sendToOne(email: string, subject: string, message: string) {
        const m = `To: ${email}\n` +
                  `Subject: ${subject}\n` +
                  `\n` +
                  `${message}`

        const encodedMessage = Buffer.from(m)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await this.gmail.users.messages.send({
            userId: email,
            requestBody: {
                raw: encodedMessage
            }
        })
    }
}
