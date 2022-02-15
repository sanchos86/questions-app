import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly mailTransport: Mail;

  private readonly defaultOptions: Partial<Mail.Options>;

  constructor(private readonly configService: ConfigService) {
    const secure =
      this.configService.get('MAIL_SECURE') === 'true' ? true : false;

    this.mailTransport = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: Number(this.configService.get('MAIL_PORT')),
      secure,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });

    this.defaultOptions = {
      // eslint-disable-next-line prettier/prettier
      from: `${this.configService.get('APP_NAME')} <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
      sender: this.configService.get('MAIL_FROM_ADDRESS'),
    };
  }

  sendMail(options: Mail.Options): Promise<void> {
    const mergedOptions = Object.assign(this.defaultOptions, options);
    return this.mailTransport.sendMail(mergedOptions);
  }
}
