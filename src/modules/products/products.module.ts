import { Module } from '@nestjs/common';
import { SearchProductsUseCase } from './domain/use-cases/search-products.use-case';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductsController } from './presentation/controllers/products.controller';
import { FindAllProductsUseCase } from './domain/use-cases/find-all-products.use-case';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    SearchProductsUseCase,
    FindAllProductsUseCase,
  ],
})
export class ProductsModule {}
