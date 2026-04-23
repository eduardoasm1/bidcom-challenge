import { Product } from '../entities/product.entity';
import type { PrismaProductRecord } from '../../infrastructure/types/product.types';
import type { CreateProductData } from '../interfaces/product.repository.interface';

export class ProductFactory {
  static fromPrismaRecord(record: PrismaProductRecord): Product {
    return new Product(
      record.id,
      record.name,
      record.description,
      record.category,
      record.brand,
      Number(record.price),
      record.stock,
      record.createdAt,
      record.updatedAt,
    );
  }

  static fromCreateData(
    data: CreateProductData,
    id: string,
    now: Date,
  ): Product {
    return new Product(
      id,
      data.name,
      data.description ?? null,
      data.category,
      data.brand,
      data.price,
      data.stock,
      now,
      now,
    );
  }
}
