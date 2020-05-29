import { Module } from '@nestjs/common';
import { LoggerModule } from "nestjs-pino";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
