import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      port: 6379,
      host: 'localhost',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);
  console.log('Notification service is listening');
}
bootstrap();
