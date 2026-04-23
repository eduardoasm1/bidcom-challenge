import type { Prisma } from '@prisma/client';

export interface PrismaProductRecord {
  id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string;
  price: Prisma.Decimal;
  stock: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
