import { SearchProductsUseCase } from './search-products.use-case';
import type {
  IProductRepository,
  SearchFilters,
  SearchProductsResult,
} from '../interfaces/product.repository.interface';
import { Product } from '../entities/product.entity';

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
  private result: SearchProductsResult = { total: 0, items: [] };
  capturedFilters: SearchFilters | null = null;

  setResult(result: SearchProductsResult) {
    this.result = result;
  }

  search(filters: SearchFilters): Promise<SearchProductsResult> {
    this.capturedFilters = filters;
    return Promise.resolve(this.result);
  }

  findAllProducts(): Promise<Product[]> {
    return Promise.resolve([]);
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

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let fakeRepo: FakeProductRepository;

  beforeEach(() => {
    fakeRepo = new FakeProductRepository();
    useCase = new SearchProductsUseCase(fakeRepo);
  });

  it('should return results from repository', async () => {
    const product = makeProduct();
    fakeRepo.setResult({ total: 1, items: [product] });

    const result = await useCase.execute({ limit: 20, offset: 0 });

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe(product.id);
  });

  it('should pass filters through to repository', async () => {
    fakeRepo.setResult({ total: 0, items: [] });

    const filters: SearchFilters = {
      name: 'Notebook',
      category: 'Laptops',
      brand: 'Lenovo',
      minPrice: 500,
      maxPrice: 2000,
      limit: 10,
      offset: 5,
    };

    await useCase.execute(filters);

    expect(fakeRepo.capturedFilters).toEqual(filters);
  });

  it('should return empty result when repository finds nothing', async () => {
    fakeRepo.setResult({ total: 0, items: [] });

    const result = await useCase.execute({ limit: 20, offset: 0 });

    expect(result.total).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('should return correct total even when limit reduces items', async () => {
    fakeRepo.setResult({
      total: 100,
      items: [makeProduct(), makeProduct({ id: 'uuid-2' })],
    });

    const result = await useCase.execute({ limit: 2, offset: 0 });

    expect(result.total).toBe(100);
    expect(result.items).toHaveLength(2);
  });
});
