import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'Current version for optimistic locking',
  })
  @IsInt()
  @IsPositive()
  version: number;
}
