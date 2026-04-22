import type { IProductRepository } from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';
import { GetProductByIdUseCase } from './get-product-by-id.use-case';
import { NotFoundException } from '@nestjs/common';

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  new Product(
    overrides.id ?? 'uuid-123',
    overrides.name ?? 'Producto Test',
    overrides.description ?? null,
    overrides.category ?? 'Test',
    overrides.brand ?? 'TestBrand',
    overrides.price ?? 99.99,
    overrides.stock ?? 10,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
  );

class FakeProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  setProduct(product: Product) {
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
}

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new GetProductByIdUseCase(fakeRepo);
  });

  it('should return product when found', async () => {
    const product = makeProduct({ id: 'uuid-456' });
    fakeRepo.setProduct(product);

    const result = await useCase.execute('uuid-456');

    expect(result.id).toBe('uuid-456');
    expect(result.name).toBe(product.name);
  });

  it('should throw NotFoundException when product not found', async () => {
    await expect(useCase.execute('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
