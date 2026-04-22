import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }
}
