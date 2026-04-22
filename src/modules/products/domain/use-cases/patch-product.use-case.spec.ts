import type {
  IProductRepository,
  PatchProductData,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';
import { PatchProductUseCase } from './patch-product.use-case';
import { NotFoundException } from '@nestjs/common';

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  new Product(
    overrides.id ?? 'uuid-123',
    overrides.name ?? 'Producto Original',
    overrides.description ?? null,
    overrides.category ?? 'General',
    overrides.brand ?? 'TestBrand',
    overrides.price ?? 100,
    overrides.stock ?? 10,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
  );

class FakeProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  addProduct(product: Product) {
    this.products.set(product.id, product);
  }

  search(): Promise<{ total: 0; items: [] }> {
    return Promise.resolve({ total: 0, items: [] });
  }

  findAllProducts(): Promise<Product[]> {
    return Promise.resolve([]);
  }

  findById(id: string): Promise<Product | null> {
    return Promise.resolve(this.products.get(id) ?? null);
  }

  create(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  update(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  patch(id: string, data: PatchProductData): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error('Not found');

    const patched = makeProduct({
      ...product,
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.brand !== undefined && { brand: data.brand }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.stock !== undefined && { stock: data.stock }),
    });
    this.products.set(id, patched);
    return Promise.resolve(patched);
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }
}

describe('PatchProductUseCase', () => {
  let useCase: PatchProductUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new PatchProductUseCase(fakeRepo);
  });

  it('should patch only provided fields', async () => {
    fakeRepo.addProduct(
      makeProduct({
        id: 'uuid-999',
        name: 'Nombre Original',
        price: 100,
        stock: 10,
      }),
    );

    const data: PatchProductData = {
      price: 150,
      stock: 20,
    };

    const result = await useCase.execute('uuid-999', data);

    expect(result.name).toBe('Nombre Original');
    expect(result.price).toBe(150);
    expect(result.stock).toBe(20);
  });

  it('should throw NotFoundException when product not found', async () => {
    const data: PatchProductData = {
      price: 200,
    };

    await expect(useCase.execute('non-existent', data)).rejects.toThrow(
      NotFoundException,
    );
  });
});
