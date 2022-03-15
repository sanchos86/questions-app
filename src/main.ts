import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { corsOptions } from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());

  if (process.env.NODE_ENV !== 'production') {
    const options: SwaggerDocumentOptions = {
      ignoreGlobalPrefix: false,
    };
    const config = new DocumentBuilder().setTitle('Questions app').build();
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
