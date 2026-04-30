import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;
    const tenantId = req.headers['x-tenant-id'] as string;

    // Lógica para resolver el tenant desde el subdominio o header
    // Ejemplo: restaurante1.rms.dev -> tenantId = restaurante1
    let resolvedTenantId = tenantId;

    if (!resolvedTenantId && host) {
      const parts = host.split('.');
      // Si el dominio es rms.dariassoft.com.ar (4 partes)
      // Un subdominio sería restaurante.rms.dariassoft.com.ar (5 partes)
      // En localhost parts.length suele ser 1 o 2.
      if (parts.length >= 4) {
        // Buscamos si hay algo antes de rms.dariassoft.com.ar
        // rms.dariassoft.com.ar -> parts.length = 4
        // restaurante.rms.dariassoft.com.ar -> parts.length = 5
        if (parts.length > 4) {
          const potentialTenant = parts[0];
          if (potentialTenant !== 'api' && potentialTenant !== 'www' && potentialTenant !== 'rms') {
            resolvedTenantId = potentialTenant;
          }
        }
      }
    }

    if (!resolvedTenantId || resolvedTenantId === 'rms' || resolvedTenantId === 'www' || resolvedTenantId === 'api') {
      req['tenantId'] = 'public';
    } else {
      req['tenantId'] = resolvedTenantId;
    }

    next();
  }
}
