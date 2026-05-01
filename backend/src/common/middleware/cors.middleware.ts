import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;

    // Validar origen
    const isAllowed = this.isOriginAllowed(origin);

    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-tenant-id,Accept,Origin');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Expose-Headers', 'x-total-count,x-page-count');
      res.header('Access-Control-Max-Age', '3600');
    }

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  }

  private isOriginAllowed(origin: string | undefined): boolean {
    // Sin origin: permitir (requests desde el mismo server)
    if (!origin) {
      return true;
    }

    // Localhost y 127.0.0.1 siempre permitidos
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return true;
    }

    // En producción: permitir *.dariassoft.com.ar
    if (origin.includes('dariassoft.com.ar')) {
      return true;
    }

    return false;
  }
}

