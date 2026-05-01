import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.APP_PORT || process.env.PORT || 3000;
  await app.listen(port);
  console.log(`RMS API running on port ${port}`);
}
bootstrap();

