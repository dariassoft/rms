import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Restaurant } from '../tenants/restaurant.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(data: any, tenantId: string): Promise<Rating> {
    const rating = this.ratingRepository.create({
      ...data,
      tenantId,
    });
    const saved = await this.ratingRepository.save(rating);

    // Actualizar el rating promedio del restaurante si es tipo 'restaurant'
    if (data.type === 'restaurant') {
      await this.updateRestaurantAverageRating(data.restaurantId);
    }

    return saved as any;
  }

  async findByRestaurant(restaurantId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { restaurantId },
      relations: ['user', 'dish'],
      order: { createdAt: 'DESC' },
    });
  }

  private async updateRestaurantAverageRating(restaurantId: string) {
    const ratings = await this.ratingRepository.find({
      where: { restaurantId, type: 'restaurant' },
    });
    if (ratings.length > 0) {
      const average = ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length;
      await this.restaurantRepository.update(restaurantId, { rating: average });
    }
  }
}
