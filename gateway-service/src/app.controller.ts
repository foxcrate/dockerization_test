import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { io, Socket } from 'socket.io-client';

@Controller()
export class AppController {
  constructor() {}
}
