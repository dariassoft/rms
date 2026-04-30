import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Dish } from './dish.entity';
import { TableEntity } from './table.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(TableEntity)
    private tableRepository: Repository<TableEntity>,
  ) {}

  async getTables(restaurantId: string): Promise<TableEntity[]> {
    return this.tableRepository.find({ where: { restaurantId } });
  }

  async updateTables(restaurantId: string, tables: any[]): Promise<void> {
    await this.tableRepository.delete({ restaurantId });
    const entities = tables.map(t => {
      const entity = new TableEntity();
      Object.assign(entity, t);
      entity.restaurantId = restaurantId;
      return entity;
    });
    await this.tableRepository.save(entities);
  }

  async findByTenantId(tenantId: string): Promise<Restaurant | null> {
    return this.restaurantRepository.findOne({
      where: { tenantId },
      relations: ['dishes', 'tables'],
    });
  }

  async findAllPublic(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      relations: ['dishes'],
    });
  }

  async search(query: string, lat?: number, lng?: number, radius: number = 10): Promise<any[]> {
    // Lógica básica de búsqueda por texto. 
    // Para proximidad real se usaría una query espacial (ST_Distance_Sphere en MySQL).
    const qb = this.restaurantRepository.createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.dishes', 'dish')
      .where('(restaurant.name LIKE :query OR restaurant.cuisineType LIKE :query OR dish.name LIKE :query)', { query: `%${query}%` });

    if (lat && lng) {
      // Haversine formula to calculate distance in KM
      qb.addSelect(
        `6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * cos(radians(restaurant.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(restaurant.latitude)))`,
        'distance'
      )
      .andWhere(
        `6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * cos(radians(restaurant.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(restaurant.latitude))) <= :radius`,
        { lat, lng, radius }
      )
      .orderBy('distance', 'ASC');
    }

    return qb.getMany();
  }
}
