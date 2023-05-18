import { injectable } from 'inversify';
import { google, Auth, gmail_v1 } from 'googleapis';
import { randInt } from '../lib/random_integer';
import { threadSleep } from '../lib/sleep';

@injectable()
export class MailService {
    auth: Auth.JWT
    gmail: gmail_v1.Gmail
    MAXIMUM_BACKOFF_TIME: number = 32000
    NUM_RETRY: number = 25

    constructor() {
        this.init()
    }
    
    async init() {
        this.auth = new google.auth.JWT({
            scopes: [
                `https://www.googleapis.com/auth/gmail.send`,
            ],
            keyFile: "googleServiceAccountKey.json",
            subject: "admin@fessior.com"
        })
        await this.auth.authorize()
        this.gmail = google.gmail({
            version: 'v1',
            auth: this.auth
        })
        console.log(`[MailService] Gmail service is ready`)
    }
    
    async sendToOne(email: string, subject: string, message: string, contentType: string = `text/html`) {
        const m = `To: ${email}\n` +
                  `Subject: ${subject}\n` +
                  `Content-Type: ${contentType}\n` +
                  `\n` +
                  `${message}`

        const encodedMessage = Buffer.from(m)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        let waitTime = 1000 + randInt(0, 1001)
        for (let i = 0; i < this.NUM_RETRY; i++) {
            console.log(`Attempt ${i + 1} to send mail to ${email} (Subject: ${subject})`)
            try {
                await this.gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: encodedMessage
                    }
                })
                break
            } catch(error) {
                // wait and try again
                await threadSleep(waitTime)
                waitTime = Math.min(2 * waitTime, this.MAXIMUM_BACKOFF_TIME) + randInt(0, 1001)
            }
        }
        console.log(`Successfully sent mail to ${email} (Subject: ${subject})`)
    }
    
    async sendToMany(emails: string[], subject: string, message: string, contentType: string = 'text/html') {
        await Promise.all(
            emails.map(email => (
                async () => {
                    await this.sendToOne(email, subject, message, contentType)
                }
            )())
        )
    }
}
