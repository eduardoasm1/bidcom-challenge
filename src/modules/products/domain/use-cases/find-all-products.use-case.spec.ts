import type { IProductRepository } from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';
import { FindAllProductsUseCase } from './find-all-products.use-case';

const makeProduct = (overrides: Partial<Product> = {}): Product =>
  new Product(
    overrides.id ?? 'uuid-1',
    overrides.name ?? 'Notebook Lenovo',
    overrides.description ?? null,
    overrides.category ?? 'Laptops',
    overrides.brand ?? 'Lenovo',
    overrides.price ?? 1299.99,
    overrides.stock ?? 10,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
  );

class FakeProductRepository implements IProductRepository {
  private result: Product[] = [];

  search(): Promise<{ total: 0; items: [] }> {
    return Promise.resolve({ total: 0, items: [] });
  }

  setResult(result: Product[]) {
    this.result = result;
  }

  findAllProducts(): Promise<Product[]> {
    return Promise.resolve(this.result);
  }

  findById(): Promise<Product | null> {
    return Promise.resolve(null);
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
}

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new FindAllProductsUseCase(fakeRepo);
  });

  it('should return results from repository', async () => {
    const product = makeProduct();
    fakeRepo.setResult([product]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(product.id);
  });

  it('should return empty result when repository finds nothing', async () => {
    fakeRepo.setResult([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
