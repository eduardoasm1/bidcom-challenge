import type {
  IProductRepository,
  UpdateProductData,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';
import { UpdateProductUseCase } from './update-product.use-case';
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

  update(id: string, data: UpdateProductData): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error('Not found');

    const updated = makeProduct({
      ...product,
      name: data.name,
      description: data.description ?? null,
      category: data.category,
      brand: data.brand,
      price: data.price,
      stock: data.stock,
    });
    this.products.set(id, updated);
    return Promise.resolve(updated);
  }

  patch(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }
}

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new UpdateProductUseCase(fakeRepo);
  });

  it('should update product when found', async () => {
    fakeRepo.addProduct(makeProduct({ id: 'uuid-789', name: 'Viejo Nombre' }));

    const data: UpdateProductData = {
      name: 'Nuevo Nombre',
      category: 'Electrónica',
      brand: 'Sony',
      price: 199.99,
      stock: 25,
    };

    const result = await useCase.execute('uuid-789', data);

    expect(result.name).toBe('Nuevo Nombre');
    expect(result.category).toBe('Electrónica');
    expect(result.price).toBe(199.99);
  });

  it('should throw NotFoundException when product not found', async () => {
    const data: UpdateProductData = {
      name: 'Nombre',
      category: 'Cat',
      brand: 'Brand',
      price: 50,
      stock: 5,
    };

    await expect(useCase.execute('non-existent', data)).rejects.toThrow(
      NotFoundException,
    );
  });
});
