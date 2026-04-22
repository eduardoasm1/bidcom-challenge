import { PrismaService } from '../../prisma/prisma.service';

interface ProductOverrides {
  name?: string;
  description?: string | null;
  category?: string;
  brand?: string;
  price?: number;
  stock?: number;
}

export class ProductBuilder {
  private attrs: ProductOverrides = {};

  withName(name: string) {
    this.attrs.name = name;
    return this;
  }
  withCategory(category: string) {
    this.attrs.category = category;
    return this;
  }
  withBrand(brand: string) {
    this.attrs.brand = brand;
    return this;
  }
  withPrice(price: number) {
    this.attrs.price = price;
    return this;
  }
  withStock(stock: number) {
    this.attrs.stock = stock;
    return this;
  }

  async build(prisma: PrismaService) {
    return prisma.db.product.create({
      data: {
        name: this.attrs.name ?? 'Test Product',
        description: this.attrs.description ?? null,
        category: this.attrs.category ?? 'General',
        brand: this.attrs.brand ?? 'TestBrand',
        price: this.attrs.price ?? 100,
        stock: this.attrs.stock ?? 10,
      },
    });
  }
}

export const aProduct = () => new ProductBuilder();
