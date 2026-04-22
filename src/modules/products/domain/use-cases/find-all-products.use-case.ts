import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAllProducts();
  }
}
