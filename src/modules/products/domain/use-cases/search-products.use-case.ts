import { Injectable, Inject } from '@nestjs/common';
import type {
  IProductRepository,
  SearchFilters,
  SearchProductsResult,
} from '../interfaces/product.repository.interface';

// aqui rompemos un poco la logica de Clean Architecture para el hecho de ser mas pragmatico
// en donde aprovechamos la instancia de inject que nos ofrece NestJs y tener menos boilerplate y simplificar codigo
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
