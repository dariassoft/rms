"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
const table_entity_1 = require("../tenants/table.entity");
let ReservationsService = class ReservationsService {
    constructor(reservationRepository, tableRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
    }
    async create(data, tenantId) {
        const { restaurantId, tableId, reservationTime, adults, children, babies, preOrderItems } = data;
        const startTime = new Date(reservationTime);
        startTime.setHours(startTime.getHours() - 1);
        const endTime = new Date(reservationTime);
        endTime.setHours(endTime.getHours() + 1);
        const existing = await this.reservationRepository.findOne({
            where: {
                tableId,
                reservationTime: (0, typeorm_2.Between)(startTime, endTime),
                status: 'confirmed',
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('La mesa no está disponible en este horario.');
        }
        const table = await this.tableRepository.findOne({ where: { id: tableId } });
        if (!table) {
            throw new common_1.BadRequestException('Mesa no encontrada.');
        }
        const totalParty = adults + children;
        if (totalParty > table.capacity) {
            throw new common_1.BadRequestException(`La mesa solo tiene capacidad para ${table.capacity} personas.`);
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
    async findAll(tenantId) {
        return this.reservationRepository.find({
            where: { tenantId },
            relations: ['table', 'user'],
        });
    }
    async findByUser(userId) {
        return this.reservationRepository.find({
            where: { userId },
            relations: ['restaurant', 'table'],
        });
    }
    async updateStatus(id, status, tenantId) {
        const reservation = await this.reservationRepository.findOne({ where: { id, tenantId } });
        if (!reservation) {
            throw new common_1.BadRequestException('Reserva no encontrada.');
        }
        reservation.status = status;
        return this.reservationRepository.save(reservation);
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(table_entity_1.TableEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map