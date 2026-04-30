import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { Restaurant } from '../tenants/restaurant.entity';
import { User } from '../users/user.entity';
import { Invoice } from '../finance/entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, User, Invoice])],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
