import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendWelcomeEmail(to: string, username: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Bienvenido a Vicnasol App!',
        html: `
        <div style="font-family: Arial, sans-serif; color: #2e5234; padding: 20px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/drl20ihvq/image/upload/v1732282936/uploads/hvtjtb5poyr2clqyxdd6.jpg" alt="Vicnasol" style="max-width: 550px;">
          </div>
          <h1 style="color: #263238;">¡Bienvenido/a a Vicnasol, ${username}!</h1>
          <p>
            Nos llena de alegría que te unas a nuestra comunidad amante de la naturaleza y la jardinería. 
            En Vicnasol encontrarás las herramientas, conocimientos y el apoyo necesario para convertir 
            cualquier espacio en un oasis verde.
          </p>
          <p>
            Desde hoy, podrás disfrutar de todas nuestras funcionalidades y explorar ideas para tus 
            proyectos de jardinería. Nuestro equipo está siempre a tu disposición para ayudarte a crecer, 
            florecer y alcanzar tus metas.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://vicnasol-henry.vercel.app" 
               style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; 
               border-radius: 5px; font-size: 16px;">Explorar Vicnasol</a>
          </div>
          <p style="color: #263238;">¡Gracias por confiar en nosotros!</p>
          <p style="color: #263238;">El equipo de <strong>Vicnasol</strong></p>
          <footer style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 14px; color: #666;">
            <p>Vicnasol - Jardinería a tu alcance</p>
            <p><a href="http://vicnasol-henry.vercel.app" style="color: #4CAF50;">www.vicnasol-henry.vercel.app.com</a></p>
          </footer>
        </div>
      `,
      };
      await this.transporter.sendMail(mailOptions);
      return 
    } catch (error: any) {
      throw new Error( error.message);
    }
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: to,
        to : process.env.EMAIL_USER,
        subject,
        text,
      };
  
      await this.transporter.sendMail(mailOptions);
      return
    } catch (error : any) {
      throw new Error( error.message);
    }
 
  }

  async sendOrderConfirmationEmail(to: string, username: string, order: any): Promise<void> {
    try {
      const serviceDetails = order.serviceProvided
        .map(service => `<li>${service.detailService} - $${service.price}</li>`)
        .join('');
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Confirmación de tu Orden en Vicnasol',
        html: `
          <div style="font-family: Arial, sans-serif; color: #2e5234; padding: 20px; line-height: 1.6;">
            <h1 style="color: #263238;">¡Tu orden ha sido confirmada, ${username}!</h1>
            <p>Gracias por confiar en <strong>Vicnasol</strong>. Aquí tienes los detalles de tu orden:</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Fecha:</strong> ${new Date(order.date).toLocaleDateString()}</li>
              <li><strong>Estado:</strong> ${order.isApproved ? 'Aprobada ✅' : 'Pendiente ⏳'}</li>
              <li><strong>Jardinero:</strong> ${order.gardener.name} (${order.gardener.email})</li>
              <li><strong>Servicios:</strong>
                <ul>
                  ${serviceDetails}
                </ul>
              </li>
            </ul>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://vicnasol-henry.vercel.app/dashboard" 
                 style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; 
                 border-radius: 5px; font-size: 16px;">Ver mi Orden</a>
            </div>
            <p style="color: #263238;">Si tienes alguna duda, no dudes en contactarnos.</p>
            <p style="color: #263238;">El equipo de <strong>Vicnasol</strong></p>
          </div>
        `,
      };
  
      await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent successfully');
    } catch (error: any) {
      console.error('Error sending confirmation email:', error.message);
      throw new Error(error.message);
    }
  }
  
  async sendOrderCancellationEmail(to: string, username: string, order: any): Promise<void> {
    try {
      // Formatear la fecha al formato yyyy-MM-dd
      const formattedDate = format(new Date(order.date), 'yyyy-MM-dd');
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Cancelación de tu Orden en Vicnasol',
        html: `
          <div style="font-family: Arial, sans-serif; color: #2e5234; padding: 20px; line-height: 1.6;">
            <h1 style="color: #263238;">Tu orden ha sido cancelada, ${username}</h1>
            <p>Nos comunicamos para informarte que la siguiente orden ha sido cancelada:</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Fecha:</strong> ${formattedDate}</li>
              <li><strong>Estado:</strong> Cancelada ❌</li>
              <li><strong>Jardinero:</strong> ${order.gardener.name} (${order.gardener.email})</li>
            </ul>
            <p>Te pedimos disculpas por cualquier inconveniente. Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://vicnasol-henry.vercel.app/dashboard" 
                 style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; 
                 border-radius: 5px; font-size: 16px;">Ver mi Historial de Órdenes</a>
            </div>
            <p style="color: #263238;">Gracias por tu atención.</p>
            <p style="color: #263238;">El equipo de <strong>Vicnasol</strong></p>
          </div>
        `,
      };
  
      await this.transporter.sendMail(mailOptions);
      console.log('Cancellation email sent successfully');
    } catch (error: any) {
      console.error('Error sending cancellation email:', error.message);
      throw new Error(error.message);
    }
  }

  async sendPaymentConfirmationEmail(to: string, username: string, order: any): Promise<void> {
    try {
      const formattedDate = format(new Date(order.date), 'yyyy-MM-dd');
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Confirmación de Pago en Vicnasol',
        html: `
          <div style="font-family: Arial, sans-serif; color: #2e5234; padding: 20px; line-height: 1.6;">
            <h1 style="color: #263238;">¡Tu pago ha sido confirmado, ${username}!</h1>
            <p>Nos complace informarte que hemos recibido tu pago para la siguiente orden:</p>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Fecha del pago:</strong> ${formattedDate}</li>
              <li><strong>Estado:</strong> Pagado ✅</li>
              <li><strong>Jardinero:</strong> ${order.gardener.name} (${order.gardener.email})</li>
              <li><strong>Servicios:</strong>
                <ul>
                  ${order.serviceProvided
                    .map(service => `<li>${service.detailService} - $${service.price}</li>`)
                    .join('')}
                </ul>
              </li>
            </ul>
            <p>Gracias por completar tu pago. Estamos emocionados de empezar a trabajar en tu orden.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://vicnasol-henry.vercel.app/dashboard" 
                 style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; 
                 border-radius: 5px; font-size: 16px;">Ver mi Orden</a>
            </div>
            <p style="color: #263238;">Si tienes alguna duda, no dudes en contactarnos.</p>
            <p style="color: #263238;">El equipo de <strong>Vicnasol</strong></p>
          </div>
        `,
      };
      await this.transporter.sendMail(mailOptions);
      console.log('Payment confirmation email sent successfully');
    } catch (error: any) {
      console.error('Error sending payment confirmation email:', error.message);
      throw new Error(error.message);
    }
  }
}
