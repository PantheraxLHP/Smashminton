import { Body, Post, Controller } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { SendCredentialsDto, sendEmailDto } from './dto/email.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('email')
export class NodemailerController {
    constructor(private readonly nodemailerService: NodemailerService) { }

    @Post('send-email')
    @ApiOperation({
        summary: 'Gửi email thông thường',
        description: 'Gửi email với nội dung tùy chỉnh'
    })
    @ApiResponse({
        status: 200,
        description: 'Email sent successfully'
    })
    async sendEmail(@Body() sendEmailDto: sendEmailDto) {
        await this.nodemailerService.sendEmail(sendEmailDto);
        return {
            message: 'Email sent successfully',
        };
    }

    @Post('employee-credentials')
    @ApiOperation({
        summary: 'Gửi username và password',
        description: 'Gửi thông tin đăng nhập cho nhân viên'
    })
    @ApiResponse({
        status: 200,
        description: 'Gửi email thành công'
    })
    async sendEmployeeCredentials(@Body() dto: SendCredentialsDto) {
        try {
            await this.nodemailerService.sendEmployeeCredentials(dto);
            return {
                message: 'Credentials sent successfully',
                success: true
            };
        } catch (error) {
            throw new Error(`Failed to send credentials: ${error.message}`);
        }
    }
}