import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, Param } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
  ) {}

  @Post('welcome')
  @HttpCode(HttpStatus.OK)
  async sendWelcomeEmail(@Body() payload: SendMailDto) {
    const { to, username } = payload;

    await this.mailService.sendWelcomeEmail(to, username);

    return {
      message: `Welcome email sent successfully to ${to}`,
    };
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendMail(@Body() body: { email: string; phone: string; message: string }) {
    const { email, phone, message } = body;

    const subject = `Sugerencia enviada por ${email}`;
    const text = `Detalles:
    - Email: ${email}
    - Teléfono: ${phone}
    - Mensaje: ${message}`;

    try {
      await this.mailService.sendMail(email, subject, text);
      return { message: `Correo enviado correctamente a hpfinal21@gmail.com` };
    } catch (error: any) {
      throw new HttpException(
        {
          message: 'Error al enviar el correo.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
