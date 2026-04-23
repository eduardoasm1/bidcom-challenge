import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/interfaces/product.repository.interface';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    await this.productRepository.delete(id);
  }
}
