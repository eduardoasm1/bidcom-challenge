import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchProductsUseCase } from '../../domain/use-cases/search-products.use-case';
import { SearchProductsQueryDto } from '../dtos/search-products-query.dto';
import { SearchProductsResponseDto } from '../dtos/search-products.response.dto';
import { ProductResponseDto } from '../dtos/product.response.dto';
import { StandardErrorDto } from '../../../../common/dtos/standard-error.dto';
import { FindAllProductsUseCase } from '../../domain/use-cases/find-all-products.use-case';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
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
}
