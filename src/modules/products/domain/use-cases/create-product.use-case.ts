import { Inject, Injectable } from '@nestjs/common';
import type {
  CreateProductData,
  IProductRepository,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(data: CreateProductData): Promise<Product> {
    return this.productRepository.create(data);
  }
}
