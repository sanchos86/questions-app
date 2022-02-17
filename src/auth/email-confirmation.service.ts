import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from '../mail/mail.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private compileTemplate(appName: string, url: string): string {
    // TODO use template engine to create better html
    return `Welcome to ${appName}. To confirm your registration, click <a href="${url}">here</a>.`;
  }

  sendConfirmationEmail(
    email: string,
    confirmationToken: string,
  ): Promise<void> {
    const appUrl = this.configService.get('APP_URL');
    const appName = this.configService.get('APP_NAME');
    const url = `${appUrl}/api/users/token/${confirmationToken}`;
    const html = this.compileTemplate(appName, url);

    return this.mailService.sendMail({
      to: email,
      html,
    });
  }
}
