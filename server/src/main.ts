import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.NODE_ENV === 'production' 
            ? ['https://smashminton.fun', 'https://www.smashminton.fun']
            : '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: process.env.NODE_ENV === 'production',
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

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
