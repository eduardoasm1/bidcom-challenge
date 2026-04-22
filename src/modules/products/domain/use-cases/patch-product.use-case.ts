import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IProductRepository,
  PatchProductData,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';

@Injectable()
export class PatchProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, data: PatchProductData): Promise<Product> {
    const existing = await this.productRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return this.productRepository.patch(id, data);
  }
}
