import { Module } from '@nestjs/common';
import { SearchProductsUseCase } from './application/use-cases/search-products.use-case';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductsController } from './presentation/controllers/products.controller';
import { FindAllProductsUseCase } from './application/use-cases/find-all-products.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { PatchProductUseCase } from './application/use-cases/patch-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { AppLoggerService } from '../../common/logger/app-logger.service';

@Module({
  controllers: [ProductsController],
  providers: [
    AppLoggerService,
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
    DeleteProductUseCase,
  ],
})
export class ProductsModule {}
