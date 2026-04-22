import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class PatchProductDto {
  @ApiProperty({ example: 'Notebook Lenovo IdeaPad', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Laptop de alta performance', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Laptops', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Lenovo', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 1299.99, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 50, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
