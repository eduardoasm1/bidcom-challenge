import { Injectable, Inject } from '@nestjs/common';
import type {
  IProductRepository,
  SearchFilters,
  SearchProductsResult,
} from '../../domain/interfaces/product.repository.interface';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(filters: SearchFilters): Promise<SearchProductsResult> {
    return this.productRepository.search(filters);
  }
}
