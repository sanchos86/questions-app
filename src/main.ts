import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { corsOptions } from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
