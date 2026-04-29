import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): object {
    return {
      name: 'RMS - Restaurant Management System',
      version: '1.0.0',
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

