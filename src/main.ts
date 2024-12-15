import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { Logger as LoggerCommon } from '@nestjs/common';

async function bootstrap() {
  const logger = new LoggerCommon('mainservice');
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('mainservice');
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('Diel Energia')
    .setDescription('The Diel API description')
    .setVersion('1.0')
    .addTag('notifications')
    .addTag('api-registries')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = Number(process.env.LISTEN_PORT || 3003);
  await app.listen(port);
  logger.log(`HTTPS server (MainService) started on port ${port}`);
}
bootstrap();
