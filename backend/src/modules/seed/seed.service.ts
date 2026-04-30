import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const runSeed = process.env.DB_RUN_SEED === 'true';
    if (!runSeed) {
      this.logger.log('Seed disabled (DB_RUN_SEED is not true)');
      return;
    }

    await this.seedUsers();
  }

  private async seedUsers() {
    const count = await this.userRepository.count();
    if (count > 0) {
      this.logger.log('Users already exist, skipping seed');
      return;
    }

    this.logger.log('Seeding initial users...');

    const domain = process.env.DOMAIN || 'rms.dev';
    const password = await bcrypt.hash('rms1234!', 10);
    const users = [
      {
        email: `superadmin@${domain}`,
        password,
        name: 'Super Admin',
        role: UserRole.SUPERADMIN,
        tenantId: 'public',
      },
      {
        email: `admin@labuena.${domain}`,
        password,
        name: 'Admin La Buena',
        role: UserRole.ADMIN,
        tenantId: 'labuena',
      },
      {
        email: `mozo@labuena.${domain}`,
        password,
        name: 'Mozo La Buena',
        role: UserRole.WAITER,
        tenantId: 'labuena',
      },
      {
        email: `chef@labuena.${domain}`,
        password,
        name: 'Chef La Buena',
        role: UserRole.CHEF,
        tenantId: 'labuena',
      },
      {
        email: `comensal@${domain}`,
        password,
        name: 'Comensal Test',
        role: UserRole.DINER,
        tenantId: 'public',
      },
    ];

    await this.userRepository.save(users);
    this.logger.log(`Seeded ${users.length} users successfully`);
  }
}
