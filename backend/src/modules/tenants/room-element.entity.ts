import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('room_elements')
export class RoomElement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // 'wall', 'window', 'door'

  @Column({ type: 'float', default: 0 })
  posX: number;

  @Column({ type: 'float', default: 0 })
  posY: number;

  @Column({ type: 'float', default: 100 })
  width: number;

  @Column({ type: 'float', default: 10 })
  height: number;

  @Column({ type: 'float', default: 0 })
  rotation: number; // Rotation in degrees

  @Column({ nullable: true })
  color: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
