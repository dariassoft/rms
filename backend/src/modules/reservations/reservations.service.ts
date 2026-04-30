import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './reservation.entity';
import { TableEntity } from '../tenants/table.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(TableEntity)
    private tableRepository: Repository<TableEntity>,
  ) {}

  async create(data: any, tenantId: string): Promise<Reservation> {
    const { restaurantId, tableId, reservationTime, adults, children, babies, preOrderItems } = data;

    // Verificar disponibilidad de la mesa en ese horario (margen de 2 horas)
    const startTime = new Date(reservationTime);
    startTime.setHours(startTime.getHours() - 1);
    const endTime = new Date(reservationTime);
    endTime.setHours(endTime.getHours() + 1);

    const existing = await this.reservationRepository.findOne({
      where: {
        tableId,
        reservationTime: Between(startTime, endTime),
        status: 'confirmed',
      },
    });

    if (existing) {
      throw new BadRequestException('La mesa no está disponible en este horario.');
    }

    // Verificar capacidad de la mesa
    const table = await this.tableRepository.findOne({ where: { id: tableId } });
    if (!table) {
      throw new BadRequestException('Mesa no encontrada.');
    }

    const totalParty = adults + children;
    if (totalParty > table.capacity) {
      throw new BadRequestException(`La mesa solo tiene capacidad para ${table.capacity} personas.`);
    }

    const reservation = this.reservationRepository.create({
      restaurantId,
      tableId,
      userId: data.userId,
      reservationTime,
      adults,
      children,
      babies,
      notes: data.notes,
      tenantId,
      status: 'pending',
      preOrderItems: preOrderItems || [],
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll(tenantId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { tenantId },
      relations: ['table', 'user'],
    });
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { userId },
      relations: ['restaurant', 'table'],
    });
  }

  async updateStatus(id: string, status: string, tenantId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id, tenantId } });
    if (!reservation) {
      throw new BadRequestException('Reserva no encontrada.');
    }
    reservation.status = status;
    return this.reservationRepository.save(reservation);
  }
}
