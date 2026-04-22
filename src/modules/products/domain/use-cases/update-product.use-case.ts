import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IProductRepository,
  UpdateProductData,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, data: UpdateProductData): Promise<Product> {
    const existing = await this.productRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.productRepository.update(id, data);
  }
}
