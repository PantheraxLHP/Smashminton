import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Đặt tiền tố toàn cầu cho tất cả các đường dẫn trừ đường dẫn gốc
    app.setGlobalPrefix('api/v1', { exclude: [''] });

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Smashminton')
        .setDescription('Smashminton API description')
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT ?? 8000;
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`);
}
bootstrap().catch((err) => console.error(err));
