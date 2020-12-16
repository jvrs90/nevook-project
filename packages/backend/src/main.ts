import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from '@Common/enums/env.enum';

async function bootstrap() {
  // checkEnv();

  //FIXME: Remove example and users
  // if (process.env.NODE_ENV === 'dev') {
  //   const { initDB } = await import('./init-mongo');
  //   await initDB();
  // }

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const port = process.env.PORT ? process.env.PORT : 3001;

  await app.listen(port);
  Logger.log(
    `Application is running on: ${process.env.SELF_DOMAIN} | PORT: ${port}`,
    'Main'
  )
}


/**
 * Check environment variables on boot
 */
function checkEnv() {
  Object.keys(Env).forEach(keyEnv => {
    if (!process.env[keyEnv])
      throw new Error(
        `${keyEnv} missing, check the .env.example file and verify that the .env file contains the same variables`
      );
  });
}

bootstrap();
