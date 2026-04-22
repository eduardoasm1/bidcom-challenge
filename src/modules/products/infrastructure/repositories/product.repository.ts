import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import {
  CreateProductData,
  IProductRepository,
  SearchFilters,
  SearchProductsResult,
} from '../../domain/interfaces/product.repository.interface';
import type { PrismaProductRecord } from '../types/product.types';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(filters: SearchFilters): Promise<SearchProductsResult> {
    const where = this.buildWhereClause(filters);

    const [total, records] = await Promise.all([
      this.prisma.db.product.count({ where }),
      this.prisma.db.product.findMany({
        where,
        take: filters.limit,
        skip: filters.offset,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      items: records.map((product) => this.toEntity(product)),
    };
  }

  private buildWhereClause(filters: SearchFilters) {
    return {
      ...(filters.name && {
        name: { contains: filters.name, mode: 'insensitive' as const },
      }),
      ...(filters.category && { category: filters.category }),
      ...(filters.brand && { brand: filters.brand }),
      ...((filters.minPrice !== undefined ||
        filters.maxPrice !== undefined) && {
        price: {
          ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
        },
      }),
    };
  }

  private toEntity(record: PrismaProductRecord): Product {
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

  async findAllProducts(): Promise<Product[]> {
    const records = await this.prisma.db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((product) => this.toEntity(product));
  }

  async create(data: CreateProductData): Promise<Product> {
    const record = await this.prisma.db.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        category: data.category,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
      },
    });
    return this.toEntity(record);
  }
}
