"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const cors_middleware_1 = require("./common/middleware/cors.middleware");
const auth_module_1 = require("./modules/auth/auth.module");
const user_entity_1 = require("./modules/users/user.entity");
const restaurants_module_1 = require("./modules/tenants/restaurants.module");
const restaurant_entity_1 = require("./modules/tenants/restaurant.entity");
const dish_entity_1 = require("./modules/tenants/dish.entity");
const table_entity_1 = require("./modules/tenants/table.entity");
const room_element_entity_1 = require("./modules/tenants/room-element.entity");
const reservations_module_1 = require("./modules/reservations/reservations.module");
const reservation_entity_1 = require("./modules/reservations/reservation.entity");
const pre_order_item_entity_1 = require("./modules/reservations/pre-order-item.entity");
const orders_module_1 = require("./modules/orders/orders.module");
const order_entity_1 = require("./modules/orders/order.entity");
const order_item_entity_1 = require("./modules/orders/order-item.entity");
const ratings_module_1 = require("./modules/ratings/ratings.module");
const rating_entity_1 = require("./modules/ratings/rating.entity");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const ingredient_entity_1 = require("./modules/inventory/entities/ingredient.entity");
const supplier_entity_1 = require("./modules/inventory/entities/supplier.entity");
const recipe_entity_1 = require("./modules/inventory/entities/recipe.entity");
const finance_module_1 = require("./modules/finance/finance.module");
const invoice_entity_1 = require("./modules/finance/entities/invoice.entity");
const super_admin_module_1 = require("./modules/super-admin/super-admin.module");
const seed_module_1 = require("./modules/seed/seed.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(cors_middleware_1.CorsMiddleware)
            .forRoutes('*')
            .apply(tenant_middleware_1.TenantMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '../.env', '.env.local'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST') || 'localhost',
                    port: configService.get('DB_PORT') || 3306,
                    username: configService.get('DB_USERNAME') || 'dev_user',
                    password: configService.get('DB_PASSWORD') || 'dev_password',
                    database: configService.get('DB_DATABASE') || 'rms_db',
                    entities: [user_entity_1.User, restaurant_entity_1.Restaurant, dish_entity_1.Dish, table_entity_1.TableEntity, room_element_entity_1.RoomElement, reservation_entity_1.Reservation, pre_order_item_entity_1.PreOrderItem, order_entity_1.Order, order_item_entity_1.OrderItem, rating_entity_1.Rating, ingredient_entity_1.Ingredient, supplier_entity_1.Supplier, recipe_entity_1.Recipe, invoice_entity_1.Invoice],
                    synchronize: configService.get('DB_SYNCHRONIZE') === 'true' || (configService.get('NODE_ENV') !== 'production'),
                    logging: configService.get('DB_LOGGING') === 'true',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            restaurants_module_1.RestaurantsModule,
            reservations_module_1.ReservationsModule,
            orders_module_1.OrdersModule,
            ratings_module_1.RatingsModule,
            inventory_module_1.InventoryModule,
            finance_module_1.FinanceModule,
            super_admin_module_1.SuperAdminModule,
            seed_module_1.SeedModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map