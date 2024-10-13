import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: {
          port: 6379,
          host: 'localhost',
        },
      },
    ]),
  ],
})
export class UserModule {}
