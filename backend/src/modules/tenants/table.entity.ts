import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 2 })
  capacity: number;

  @Column({ default: 2 })
  baseCapacity: number; // Original capacity when table is alone

  @Column({ type: 'simple-json', nullable: true })
  joinedWith: string[]; // Array of table IDs that this table is joined with

  @Column({ type: 'int', default: 0 })
  occupiedSides: number; // Number of sides that are joined with other tables

  @Column({ type: 'float', default: 0 })
  posX: number;

  @Column({ type: 'float', default: 0 })
  posY: number;

  @Column({ type: 'float', default: 0 })
  rotation: number; // Rotation in degrees

  @Column({ nullable: true })
  shape: string; // 'round', 'square', 'rectangular'

  @Column({ default: 'active' })
  status: string; // 'active', 'inactive'

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
