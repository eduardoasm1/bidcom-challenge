import { Inject, Injectable } from '@nestjs/common';
import type {
  CreateProductData,
  IProductRepository,
} from '../../domain/interfaces/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';

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
