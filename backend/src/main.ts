import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './core/http-exception.filter';
import { LoggingInterceptor } from './core/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // initialize app

  const configService = app.get(ConfigService); // to access env variables

  const port = configService.get<number>('PORT'); // read port number from env file

  // setting up cors policy
  app.enableCors({
    origin: configService.get<string>('frontend_url'),
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalInterceptors(new LoggingInterceptor()); // register global interceptors - this will log request info

  app.useGlobalFilters(new HttpExceptionFilter()); // resgister global filters - this will handle formatting of response for http exceptions

  app.useGlobalPipes(new ValidationPipe());

  // add api to each routes
  // app.setGlobalPrefix('api');

  // enable api versions - like - v1, v2
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(port);
}
bootstrap();
