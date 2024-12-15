import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import pino from 'pino';
import pretty from 'pino-pretty';
import { createStream } from 'rotating-file-stream';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { ApiRegistriesModule } from './api-registries/apiRegistries.module';

@Module({
  imports: [
    NotificationsModule,
    ApiRegistriesModule,
    PrismaModule,
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        stream: pino.multistream([
          {
            stream: createStream('./logs/file.log', {
              size: '100M', // rotate every 100 MegaBytes written
              interval: '1d', // rotate daily
              compress: 'gzip', // compress rotated files
            }),
          },
          { stream: pretty() },
        ]),
      },
    }),
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('API_GATEWAY_URL'),
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: AuthGuard,
      useFactory: (httpService: HttpService) => {
        return new AuthGuard(httpService);
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
