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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreOrderItem = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
const dish_entity_1 = require("../tenants/dish.entity");
let PreOrderItem = class PreOrderItem {
};
exports.PreOrderItem = PreOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PreOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reservation_id' }),
    __metadata("design:type", String)
], PreOrderItem.prototype, "reservationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reservation_entity_1.Reservation),
    (0, typeorm_1.JoinColumn)({ name: 'reservation_id' }),
    __metadata("design:type", reservation_entity_1.Reservation)
], PreOrderItem.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dish_id' }),
    __metadata("design:type", String)
], PreOrderItem.prototype, "dishId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dish_entity_1.Dish),
    (0, typeorm_1.JoinColumn)({ name: 'dish_id' }),
    __metadata("design:type", dish_entity_1.Dish)
], PreOrderItem.prototype, "dish", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], PreOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PreOrderItem.prototype, "priceAtOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PreOrderItem.prototype, "notes", void 0);
exports.PreOrderItem = PreOrderItem = __decorate([
    (0, typeorm_1.Entity)('pre_order_items')
], PreOrderItem);
//# sourceMappingURL=pre-order-item.entity.js.map