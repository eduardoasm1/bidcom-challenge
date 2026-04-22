import { Module } from '@nestjs/common';
import { SearchProductsUseCase } from './domain/use-cases/search-products.use-case';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductsController } from './presentation/controllers/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    SearchProductsUseCase,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],
})
export class ProductsModule {}
