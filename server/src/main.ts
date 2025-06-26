import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    // Create the main HTTP application
    const app = await NestFactory.create(AppModule);

    // Add microservice capabilities to the same app instance
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.MQTT,
        options: {
            url: 'mqtt://localhost:1883',
            clientId: 'smashminton-server',
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        },
    });

    app.enableCors({
        origin: process.env.CLIENT || 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Cho phép gửi cookies
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

    // Start all microservices
    await app.startAllMicroservices();

    // Start the HTTP server
    const port = process.env.PORT ?? 8000;
    await app.listen(port);
    console.log(`HTTP Server is running on http://localhost:${port}`);
    console.log(`MQTT Microservice is running on mqtt://localhost:1883`);
}
bootstrap().catch((err) => console.error(err));
