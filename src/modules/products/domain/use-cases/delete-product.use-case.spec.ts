import type { IProductRepository } from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';
import { DeleteProductUseCase } from './delete-product.use-case';
import { NotFoundException } from '@nestjs/common';

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  new Product(
    overrides.id ?? 'uuid-123',
    overrides.name ?? 'Producto Test',
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
  deletedIds: string[] = [];

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

  patch(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  delete(id: string): Promise<void> {
    this.deletedIds.push(id);
    this.products.delete(id);
    return Promise.resolve();
  }
}

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new DeleteProductUseCase(fakeRepo);
  });

  it('should delete product when found', async () => {
    fakeRepo.addProduct(makeProduct({ id: 'uuid-to-delete' }));

    await useCase.execute('uuid-to-delete');

    expect(fakeRepo.deletedIds).toContain('uuid-to-delete');
    const stillExists = await fakeRepo.findById('uuid-to-delete');
    expect(stillExists).toBeNull();
  });

  it('should throw NotFoundException when product not found', async () => {
    await expect(useCase.execute('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
