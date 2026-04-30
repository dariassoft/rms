import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { TableEntity } from '../tenants/table.entity';
export declare class ReservationsService {
    private reservationRepository;
    private tableRepository;
    constructor(reservationRepository: Repository<Reservation>, tableRepository: Repository<TableEntity>);
    create(data: any, tenantId: string): Promise<Reservation>;
    findAll(tenantId: string): Promise<Reservation[]>;
    findByUser(userId: string): Promise<Reservation[]>;
    updateStatus(id: string, status: string, tenantId: string): Promise<Reservation>;
}
