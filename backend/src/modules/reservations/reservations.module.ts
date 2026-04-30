import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './reservation.entity';
import { TableEntity } from '../tenants/table.entity';
import { PreOrderItem } from './pre-order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, TableEntity, PreOrderItem])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
