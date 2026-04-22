import { Module } from '@nestjs/common';
import { SearchProductsUseCase } from './domain/use-cases/search-products.use-case';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductsController } from './presentation/controllers/products.controller';
import { FindAllProductsUseCase } from './domain/use-cases/find-all-products.use-case';
import { CreateProductUseCase } from './domain/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from './domain/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from './domain/use-cases/update-product.use-case';
import { PatchProductUseCase } from './domain/use-cases/patch-product.use-case';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    SearchProductsUseCase,
    FindAllProductsUseCase,
    CreateProductUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    PatchProductUseCase,
  ],
})
export class ProductsModule {}
