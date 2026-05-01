import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { CorsMiddleware } from './common/middleware/cors.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/user.entity';
import { RestaurantsModule } from './modules/tenants/restaurants.module';
import { Restaurant } from './modules/tenants/restaurant.entity';
import { Dish } from './modules/tenants/dish.entity';
import { TableEntity } from './modules/tenants/table.entity';
import { RoomElement } from './modules/tenants/room-element.entity';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { Reservation } from './modules/reservations/reservation.entity';
import { PreOrderItem } from './modules/reservations/pre-order-item.entity';
import { OrdersModule } from './modules/orders/orders.module';
import { Order } from './modules/orders/order.entity';
import { OrderItem } from './modules/orders/order-item.entity';
import { RatingsModule } from './modules/ratings/ratings.module';
import { Rating } from './modules/ratings/rating.entity';
import { InventoryModule } from './modules/inventory/inventory.module';
import { Ingredient } from './modules/inventory/entities/ingredient.entity';
import { Supplier } from './modules/inventory/entities/supplier.entity';
import { Recipe } from './modules/inventory/entities/recipe.entity';
import { FinanceModule } from './modules/finance/finance.module';
import { Invoice } from './modules/finance/entities/invoice.entity';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 3306,
        username: configService.get<string>('DB_USERNAME') || 'dev_user',
        password: configService.get<string>('DB_PASSWORD') || 'dev_password',
        database: configService.get<string>('DB_DATABASE') || 'rms_db',
        entities: [User, Restaurant, Dish, TableEntity, RoomElement, Reservation, PreOrderItem, Order, OrderItem, Rating, Ingredient, Supplier, Recipe, Invoice],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true' || (configService.get<string>('NODE_ENV') !== 'production'),
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RestaurantsModule,
    ReservationsModule,
    OrdersModule,
    RatingsModule,
    InventoryModule,
    FinanceModule,
    SuperAdminModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const nodeEnv = process.env.NODE_ENV;

    // Aplicar CORS middleware SOLO en producción
    if (nodeEnv === 'production') {
      consumer
        .apply(CorsMiddleware)
        .forRoutes('*');
    }

    consumer
      .apply(TenantMiddleware)
      .forRoutes('*');
  }
}

