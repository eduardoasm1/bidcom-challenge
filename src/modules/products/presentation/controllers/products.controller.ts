import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchProductsUseCase } from '../../domain/use-cases/search-products.use-case';
import { SearchProductsQueryDto } from '../dtos/search-products-query.dto';
import { SearchProductsResponseDto } from '../dtos/search-products.response.dto';
import { ProductResponseDto } from '../dtos/product.response.dto';
import { StandardErrorDto } from '../../../../common/dtos/standard-error.dto';
import { FindAllProductsUseCase } from '../../domain/use-cases/find-all-products.use-case';
import { CreateProductUseCase } from '../../domain/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '../../domain/use-cases/get-product-by-id.use-case';
import { UpdateProductUseCase } from '../../domain/use-cases/update-product.use-case';
import { CreateProductDto } from '../dtos/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
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
    const result = await this.searchProductsUseCase.execute({
      name: query.name,
      category: query.category,
      brand: query.brand,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    });

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
  findAllProducts() {
    return this.findAllProductsUseCase.execute();
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
  async update(
    @Param('id') id: string,
    @Body() dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(id, {
      name: dto.name,
      description: dto.description,
      category: dto.category,
      brand: dto.brand,
      price: dto.price,
      stock: dto.stock,
    });

    return ProductResponseDto.fromEntity(product);
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

    return ProductResponseDto.fromEntity(product);
  }
}
