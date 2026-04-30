import { ReservationsService } from './reservations.service';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(data: any, req: any): Promise<import("./reservation.entity").Reservation>;
    findAll(req: any): Promise<import("./reservation.entity").Reservation[]>;
    findMy(req: any): Promise<import("./reservation.entity").Reservation[]>;
    updateStatus(id: string, status: string, req: any): Promise<import("./reservation.entity").Reservation>;
}
