import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Product } from '../../domain/entities/product.entity';
import {
  CreateProductData,
  IProductRepository,
  PatchProductData,
  SearchFilters,
  SearchProductsResult,
  UpdateProductData,
} from '../../domain/interfaces/product.repository.interface';
import type { PrismaProductRecord } from '../types/product.types';
import { ProductFactory } from '../../domain/factories/product.factory';

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
      items: records.map((product) => ProductFactory.fromPrismaRecord(product)),
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

  async findAllProducts(): Promise<Product[]> {
    const records = await this.prisma.db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((product) => ProductFactory.fromPrismaRecord(product));
  }

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.db.product.findUnique({
      where: { id },
    });
    return record ? ProductFactory.fromPrismaRecord(record) : null;
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
    return ProductFactory.fromPrismaRecord(record);
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const record = await this.prisma.db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
        category: data.category,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
      },
    });
    return ProductFactory.fromPrismaRecord(record);
  }

  async patch(id: string, data: PatchProductData): Promise<Product> {
    const record = await this.prisma.db.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.brand !== undefined && { brand: data.brand }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    });
    return ProductFactory.fromPrismaRecord(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.db.product.delete({
      where: { id },
    });
  }
}
