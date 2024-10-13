import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SocketModule } from './socket/socket.module';
import { RoomModule } from './room/room.module';
import { AuthGuard } from './user/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    UserModule,
    SocketModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
  exports: [AuthGuard],
})
export class AppModule {}
