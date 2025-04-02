import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  // Enable microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('AUTH_SERVICE_PORT', 3001),
    },
  });
  
  // Enable REST API as well
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(configService.get('AUTH_API_PORT', 3000));
}
bootstrap();
