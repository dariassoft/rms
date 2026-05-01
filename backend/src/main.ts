import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como cURL, Postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost',
        'http://127.0.0.1',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
        process.env.FRONTEND_URL,
        'https://rms.dariassoft.com.ar'
      ];
      
      // Check for wildcard subdomains if needed, or explicitly matching
      if (origin.endsWith('.rms.dariassoft.com.ar') || origin === 'https://rms.dariassoft.com.ar') {
         return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // En producción a veces es mejor permitir o registrar.
        // Si tienes problemas de CORS en preflight, puedes poner: callback(null, true) temporalmente.
        callback(null, true); // Permitir todo para que CorsMiddleware lo maneje o NestJS default
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, x-tenant-id, Accept, Origin, X-Requested-With',
  });

  const port = process.env.APP_PORT || process.env.PORT || 3000;
  await app.listen(port);
  console.log(`RMS API running on port ${port}`);
}
bootstrap();
