import type {
  CreateProductData,
  IProductRepository,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';
import { CreateProductUseCase } from './create-product.use-case';

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  new Product(
    overrides.id ?? 'uuid-new',
    overrides.name ?? 'Nuevo Producto',
    overrides.description ?? null,
    overrides.category ?? 'General',
    overrides.brand ?? 'TestBrand',
    overrides.price ?? 299.99,
    overrides.stock ?? 20,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
  );

class FakeProductRepository implements IProductRepository {
  search(): Promise<{ total: 0; items: [] }> {
    return Promise.resolve({ total: 0, items: [] });
  }

  findAllProducts(): Promise<Product[]> {
    return Promise.resolve([]);
  }

  findById(): Promise<Product | null> {
    return Promise.resolve(null);
  }

  update(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  patch(): Promise<Product> {
    return Promise.resolve({} as Product);
  }

  delete(): Promise<void> {
    return Promise.resolve();
  }

  create(data: CreateProductData): Promise<Product> {
    return Promise.resolve(
      makeProduct({
        name: data.name,
        description: data.description ?? null,
        category: data.category,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
      }),
    );
  }
}

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new CreateProductUseCase(fakeRepo);
  });

  it('should create product with given data', async () => {
    const data: CreateProductData = {
      name: 'Mouse Logitech',
      description: 'Mouse inalámbrico',
      category: 'Periféricos',
      brand: 'Logitech',
      price: 49.99,
      stock: 100,
    };

    const result = await useCase.execute(data);

    expect(result.name).toBe(data.name);
    expect(result.category).toBe(data.category);
    expect(result.price).toBe(data.price);
  });
});
