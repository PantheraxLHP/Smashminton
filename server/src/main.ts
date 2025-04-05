import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.enableCors({
    //     origin: 'http://localhost:3000', // Domain của frontend
    //     credentials: true, // Cho phép gửi cookies
    // });

    app.setGlobalPrefix('api/v1', { exclude: [''] });

    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Smashminton')
        .setDescription('Smashminton API description')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT ?? 8000;
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`);
}
bootstrap().catch((err) => console.error(err));
