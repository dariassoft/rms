import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS de forma explícita y robusta
  app.enableCors({
    origin: (origin, callback) => {
      // Sin origin (requests desde el mismo dominio o herramientas internas): permitir
      if (!origin) {
        callback(null, true);
        return;
      }

      // Siempre permitir localhost y 127.0.0.1
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
        return;
      }

      // En producción: permitir cualquier origen que sea *.dariassoft.com.ar
      if (origin.includes('dariassoft.com.ar')) {
        console.log(`CORS allowed for origin: ${origin}`);
        callback(null, true);
        return;
      }

      // Rechazar todo lo demás
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'Accept', 'Origin'],
    exposedHeaders: ['x-total-count', 'x-page-count'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
    maxAge: 3600,
  });

  const port = process.env.APP_PORT || process.env.PORT || 3000;
  await app.listen(port);
  console.log(`RMS API running on port ${port}`);
}
bootstrap();

