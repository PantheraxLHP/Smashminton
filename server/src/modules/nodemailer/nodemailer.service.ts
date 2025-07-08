import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendCredentialsDto, sendEmailDto, SendResetPasswordDto } from './dto/email.dto';
import { generateResetPasswordTemplate, generateSimpleCredentialsTemplate } from './dto/template.dto';

@Injectable()
export class NodemailerService {
  constructor(private readonly configService: ConfigService) { }

  emailTransporter() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(sendEmailDto: sendEmailDto) {
    const { recipient, subject, html, text } = sendEmailDto;
    const transport = this.emailTransporter();
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: recipient,
      subject: subject,
      html: html,
    };
    try {
      const info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendEmployeeCredentials(dto: SendCredentialsDto) {
    const htmlContent = generateSimpleCredentialsTemplate(dto.username, dto.password);
    const transport = this.emailTransporter();
    const textContent = `
        Thông tin đăng nhập:
        Username: ${dto.username}
        Password: ${dto.password}

        Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên.
                `;
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: dto.email,
      subject: 'Thông tin đăng nhập',
      html: htmlContent,
      text: textContent
    };
    try {
      const info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendResetPassword(dto: SendResetPasswordDto) {
    const htmlContent = generateResetPasswordTemplate(dto.link);
    const transport = this.emailTransporter();
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get('EMAIL_FROM'),
      to: dto.email,
      subject: 'Reset Password',
      html: htmlContent,
    };
    try {
      const info = await transport.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}