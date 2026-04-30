import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../tenants/restaurant.entity';
import { User } from '../users/user.entity';
import { Invoice } from '../finance/entities/invoice.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getGlobalStats() {
    const [totalRestaurants, totalUsers, totalRevenue] = await Promise.all([
      this.restaurantRepository.count(),
      this.userRepository.count(),
      this.invoiceRepository.sum('amount'),
    ]);

    // Obtener facturación por mes (simulado para este ejemplo rápido)
    const recentInvoices = await this.invoiceRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalRestaurants,
      totalUsers,
      totalRevenue: totalRevenue || 0,
      recentActivity: recentInvoices,
    };
  }

  async getAllRestaurants() {
    return this.restaurantRepository.find();
  }
}
