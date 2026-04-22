import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Lenovo IdeaPad' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Laptop de alta performance', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Laptops' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 'Lenovo' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({ example: 1299.99, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}
