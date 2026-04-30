import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const domain = process.env.DOMAIN || 'rms.dariassoft.com.ar';
      
      // Limpiar el origen (quitar "/" al final si existe)
      const cleanOrigin = origin.replace(/\/$/, '');
      
      const isAllowed = 
        cleanOrigin === process.env.FRONTEND_URL ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1') ||
        cleanOrigin === `http://${domain}` ||
        cleanOrigin === `https://${domain}` ||
        cleanOrigin === `http://api.${domain}` ||
        cleanOrigin === `https://api.${domain}` ||
        cleanOrigin.endsWith(`.${domain}`);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,x-tenant-id',
  });

  const port = process.env.APP_PORT || process.env.PORT || 3000;
  await app.listen(port);
  console.log(`RMS API running on port ${port}`);
}
bootstrap();

