import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Cache } from 'cache-manager';
import { SearchProductsUseCase } from '../../domain/use-cases/search-products.use-case';
import { AppLoggerService } from '../../../../common/logger/app-logger.service';
import { SearchProductsQueryDto } from '../dtos/search-products-query.dto';
import { SearchProductsResponseDto } from '../dtos/search-products.response.dto';
import { ProductResponseDto } from '../dtos/product.response.dto';
import { StandardErrorDto } from '../../../../common/dtos/standard-error.dto';
import { FindAllProductsUseCase } from '../../domain/use-cases/find-all-products.use-case';
import { CreateProductUseCase } from '../../domain/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '../../domain/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from '../../domain/use-cases/update-product.use-case';
import { PatchProductUseCase } from '../../domain/use-cases/patch-product.use-case';
import { DeleteProductUseCase } from '../../domain/use-cases/delete-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PatchProductDto } from '../dtos/patch-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly CACHE_KEY_ALL_PRODUCTS = 'all_products';

  constructor(
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly patchProductUseCase: PatchProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly logger: AppLoggerService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) { }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos', operationId: 'searchProducts' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda',
    type: SearchProductsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno',
    type: StandardErrorDto,
  })
  async search(
    @Query() query: SearchProductsQueryDto,
  ): Promise<SearchProductsResponseDto> {
    this.logger.log(
      `Searching products with filters: ${JSON.stringify(query)}`,
      'ProductsController',
    );
    const result = await this.searchProductsUseCase.execute({
      name: query.name,
      category: query.category,
      brand: query.brand,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    });
    this.logger.log(`Found ${result.total} products`, 'ProductsController');

    return {
      total: result.total,
      items: result.items.map((product) =>
        ProductResponseDto.fromEntity(product),
      ),
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener lista de productos',
    operationId: 'findAllProducts',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda',
    type: SearchProductsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno',
    type: StandardErrorDto,
  })
  async findAllProducts() {
    const cached = await this.cacheManager.get(this.CACHE_KEY_ALL_PRODUCTS);
    if (cached) {
      this.logger.log('Returning cached products', 'ProductsController');
      return cached;
    }

    const products = await this.findAllProductsUseCase.execute();
    const response = {
      items: products.map((product) => ProductResponseDto.fromEntity(product)),
    };
    await this.cacheManager.set(this.CACHE_KEY_ALL_PRODUCTS, response);
    return response;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    operationId: 'getProductById',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno',
    type: StandardErrorDto,
  })
  async getById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.getProductByIdUseCase.execute(id);
    return ProductResponseDto.fromEntity(product);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar parcialmente un producto',
    operationId: 'patchProduct',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado parcialmente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Request inválido',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de versión',
    type: StandardErrorDto,
  })
  async patch(
    @Param('id') id: string,
    @Body() dto: PatchProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.patchProductUseCase.execute(id, dto);

    await this.cacheManager.del(this.CACHE_KEY_ALL_PRODUCTS);
    return ProductResponseDto.fromEntity(product);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Reemplazar un producto',
    operationId: 'updateProduct',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Request inválido',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de versión',
    type: StandardErrorDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(id, {
      name: dto.name,
      description: dto.description,
      category: dto.category,
      brand: dto.brand,
      price: dto.price,
      stock: dto.stock,
      version: dto.version,
    });

    await this.cacheManager.del(this.CACHE_KEY_ALL_PRODUCTS);
    return ProductResponseDto.fromEntity(product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un producto',
    operationId: 'deleteProduct',
  })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
    type: StandardErrorDto,
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
    await this.cacheManager.del(this.CACHE_KEY_ALL_PRODUCTS);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un producto', operationId: 'createProduct' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Request inválido',
    type: StandardErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno',
    type: StandardErrorDto,
  })
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      brand: dto.brand,
      price: dto.price,
      stock: dto.stock,
    });

    await this.cacheManager.del(this.CACHE_KEY_ALL_PRODUCTS);
    return ProductResponseDto.fromEntity(product);
  }
}
