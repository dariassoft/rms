import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
    private seedUsers;
}
