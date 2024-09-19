import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { SuccessResponse } from '../common/models/success-response';
import { ContactDto } from './dtos/contact.dto';

@Injectable()
export class SupportService {
  constructor(
    private readonly emailService: EmailService,
  ) { }

  async contact({ email, subject, message }: ContactDto) {
    const text = `A user has sent you a support ticket\n\nemail: ${email}\nsubject: ${subject}\nmessage: ${message}`
    await this.emailService.sendMailToSupport('New user support ticket', text);
    return new SuccessResponse(true);
  }
}
