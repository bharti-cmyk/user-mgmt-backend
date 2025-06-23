import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Allow all origins by default
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties not in DTOs
    forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
    transform: true, // Automatically transform payloads to DTO instances
  }));

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.setGlobalPrefix('api');

  await app.listen(4000);
}
bootstrap();
