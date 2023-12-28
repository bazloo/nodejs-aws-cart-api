import { Injectable } from '@nestjs/common';
import { CartItem } from '../cart.entities';
// import { v4 } from 'uuid';

import { Cart, CartStatuses } from '../models';
import { Cart as CartEntity } from '../cart.entities'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>
  ) {}

  findByUserId(user_id: string): Promise<CartEntity> {
    return this.cartRepository.findOneBy({ user_id });
  }

  createByUserId(user_id: string) {
    const newCart = this.cartRepository.create({
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
      status: CartStatuses.OPEN,
    });

    return this.cartRepository.save(newCart);
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity & { items: CartItem[] }> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return { ...userCart, items: [] };
    }
    // @ts-ignore
    const cart = await this.createByUserId(userId);
    return { ...cart, items: [] }
  }

  // updateByUserId(userId: string, { items }: Cart): Cart {
  //   const { id, ...rest } = this.findOrCreateByUserId(userId);
  //
  //   const updatedCart = {
  //     id,
  //     ...rest,
  //     items: [ ...items ],
  //   }
  //
  //   this.userCarts[ userId ] = { ...updatedCart };
  //
  //   return { ...updatedCart };
  // }

  removeByUserId(userId): void {
    this.userCarts[ userId ] = null;
  }

}
