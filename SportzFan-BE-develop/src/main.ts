import { NestFactory } from '@nestjs/core';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { json } from 'body-parser';
import * as dotenv from 'dotenv';
import * as CloneBuffer from 'clone-buffer';
import * as expressBasicAuth from 'express-basic-auth';

import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { AllExceptionsFilter } from './common/exception/all-exceptions.filter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  app.enableCors({
    origin: '*',
  });

  app.use(
    json({
      verify: (req: any, res, buf) => {
        // important to store rawBody for Stripe signature verification
        if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
          req.rawBody = CloneBuffer(buf);
        }
        return true;
      },
    }),
  );

  const seedService = app.get(SeedService);
  if (process.env.MODE === 'PROD') {
    await seedService.startProductionSeed();
  } else {
    await seedService.startDevelopmentSeed();
  }

  const options = new DocumentBuilder()
    .setTitle('SportzFan System API')
    .setDescription('This API service is for SportzFan')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(
    '/doc',
    expressBasicAuth({
      challenge: true,
      users: {
        sportz: 'sportz',
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
