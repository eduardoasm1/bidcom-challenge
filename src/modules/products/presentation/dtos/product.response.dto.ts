import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'Notebook Lenovo IdeaPad' })
  name: string;

  @ApiProperty({ example: 'Laptop de alta performance', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'Laptops' })
  category: string;

  @ApiProperty({ example: 'Lenovo' })
  brand: string;

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
