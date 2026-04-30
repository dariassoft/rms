import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Restaurant } from '../tenants/restaurant.entity';
import { TableEntity } from '../tenants/table.entity';
import { User } from '../users/user.entity';
import { PreOrderItem } from './pre-order-item.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @ManyToOne(() => Restaurant)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'table_id', nullable: true })
  tableId: string;

  @ManyToOne(() => TableEntity)
  @JoinColumn({ name: 'table_id' })
  table: TableEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PreOrderItem, (item) => item.reservation, { cascade: true })
  preOrderItems: PreOrderItem[];

  @Column({ type: 'timestamp' })
  reservationTime: Date;

  @Column({ default: 1 })
  adults: number;

  @Column({ default: 0 })
  children: number;

  @Column({ default: 0 })
  babies: number;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'confirmed', 'cancelled', 'completed'

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'tenant_id' })
  tenantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
