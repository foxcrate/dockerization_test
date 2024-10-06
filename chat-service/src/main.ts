import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { RedisIoAdapter } from './redis-io-adaptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      port: 6379,
      host: 'localhost',
    },
  });

  // app.useWebSocketAdapter(new RedisIoAdapter(app));

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log('Chat service is listening');
}

bootstrap();
