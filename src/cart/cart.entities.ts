import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity,
} from 'typeorm';

import { CartStatuses } from './models';

@Entity({ name: 'carts' })
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;

  @Column({ type: 'enum', enum: CartStatuses })
  status: CartStatuses;
}

@Entity({ name: 'cart_items' })
export class CartItem extends BaseEntity {
  @PrimaryColumn('uuid')
  cart_id: string;

  @PrimaryColumn('uuid')
  product_id: string;

  @Column('integer')
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}