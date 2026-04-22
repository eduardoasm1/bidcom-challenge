import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../../../prisma/prisma.module';
import { PrismaService } from '../../../../prisma/prisma.service';
import { clearDatabase } from '../../../../testing/database.helper';
import { aProduct } from '../../../../testing/builders/product.builder';
import { ProductRepository } from './product.repository';

describe('ProductRepository (Integration)', () => {
  let module: TestingModule;
  let repo: ProductRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ProductRepository],
    }).compile();

    repo = module.get(ProductRepository);
    prisma = module.get(PrismaService);
  });

  afterAll(() => module.close());

  beforeEach(() => clearDatabase(prisma));

  describe('search', () => {
    it('should return all products with no filters', async () => {
      await aProduct().withName('Notebook').build(prisma);
      await aProduct().withName('Mouse').build(prisma);

      const result = await repo.search({ limit: 20, offset: 0 });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('should filter by name (partial, case insensitive)', async () => {
      await aProduct().withName('Notebook Lenovo').build(prisma);
      await aProduct().withName('notebook dell').build(prisma);
      await aProduct().withName('Mouse Logitech').build(prisma);

      const result = await repo.search({
        name: 'notebook',
        limit: 20,
        offset: 0,
      });

      expect(result.total).toBe(2);
      expect(
        result.items.every((p) => p.name.toLowerCase().includes('notebook')),
      ).toBe(true);
    });

    it('should filter by category', async () => {
      await aProduct().withCategory('Laptops').build(prisma);
      await aProduct().withCategory('Laptops').build(prisma);
      await aProduct().withCategory('Peripherals').build(prisma);

      const result = await repo.search({
        category: 'Laptops',
        limit: 20,
        offset: 0,
      });

      expect(result.total).toBe(2);
      expect(result.items.every((p) => p.category === 'Laptops')).toBe(true);
    });

    it('should filter by brand', async () => {
      await aProduct().withBrand('Lenovo').build(prisma);
      await aProduct().withBrand('Dell').build(prisma);

      const result = await repo.search({
        brand: 'Lenovo',
        limit: 20,
        offset: 0,
      });

      expect(result.total).toBe(1);
      expect(result.items[0].brand).toBe('Lenovo');
    });

    it('should filter by minPrice', async () => {
      await aProduct().withPrice(100).build(prisma);
      await aProduct().withPrice(500).build(prisma);
      await aProduct().withPrice(1500).build(prisma);

      const result = await repo.search({ minPrice: 500, limit: 20, offset: 0 });

      expect(result.total).toBe(2);
      expect(result.items.every((p) => p.price >= 500)).toBe(true);
    });

    it('should filter by maxPrice', async () => {
      await aProduct().withPrice(100).build(prisma);
      await aProduct().withPrice(500).build(prisma);
      await aProduct().withPrice(1500).build(prisma);

      const result = await repo.search({ maxPrice: 500, limit: 20, offset: 0 });

      expect(result.total).toBe(2);
      expect(result.items.every((p) => p.price <= 500)).toBe(true);
    });

    it('should filter by price range', async () => {
      await aProduct().withPrice(100).build(prisma);
      await aProduct().withPrice(500).build(prisma);
      await aProduct().withPrice(1500).build(prisma);

      const result = await repo.search({
        minPrice: 200,
        maxPrice: 1000,
        limit: 20,
        offset: 0,
      });

      expect(result.total).toBe(1);
      expect(result.items[0].price).toBe(500);
    });

    it('should apply limit and offset for pagination', async () => {
      await aProduct().withName('Product A').build(prisma);
      await aProduct().withName('Product B').build(prisma);
      await aProduct().withName('Product C').build(prisma);

      const page1 = await repo.search({ limit: 2, offset: 0 });
      const page2 = await repo.search({ limit: 2, offset: 2 });

      expect(page1.total).toBe(3);
      expect(page1.items).toHaveLength(2);
      expect(page2.total).toBe(3);
      expect(page2.items).toHaveLength(1);
    });

    it('should return empty result when nothing matches', async () => {
      await aProduct().withBrand('Lenovo').build(prisma);

      const result = await repo.search({
        brand: 'NonExistentBrand',
        limit: 20,
        offset: 0,
      });

      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should map price as number, not Decimal', async () => {
      await aProduct().withPrice(999.99).build(prisma);

      const result = await repo.search({ limit: 20, offset: 0 });

      expect(typeof result.items[0].price).toBe('number');
      expect(result.items[0].price).toBe(999.99);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      await aProduct().withName('Product A').build(prisma);
      await aProduct().withName('Product B').build(prisma);
      await aProduct().withName('Product C').build(prisma);

      const result = await repo.findAllProducts();

      expect(result).toHaveLength(3);
    });

    it('should not return products if not have', async () => {
      const result = await repo.findAllProducts();

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create and return product', async () => {
      const data = {
        name: 'Teclado Mecánico',
        description: 'RGB gaming keyboard',
        category: 'Periféricos',
        brand: 'Redragon',
        price: 89.99,
        stock: 50,
      };

      const result = await repo.create(data);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(data.name);
      expect(result.price).toBe(data.price);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const created = await aProduct()
        .withName('Monitor Dell')
        .withPrice(299.99)
        .build(prisma);

      const result = await repo.findById(created.id);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
      expect(result!.name).toBe('Monitor Dell');
    });

    it('should return null when not found', async () => {
      const result = await repo.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      const created = await aProduct()
        .withName('Nombre Original')
        .withPrice(100)
        .build(prisma);

      const updated = await repo.update(created.id, {
        name: 'Nombre Actualizado',
        description: 'Nueva descripción',
        category: 'Nueva Categoría',
        brand: 'Nueva Marca',
        price: 150,
        stock: 20,
      });

      expect(updated.id).toBe(created.id);
      expect(updated.name).toBe('Nombre Actualizado');
      expect(updated.price).toBe(150);

      // Verificar que realmente persistió
      const fromDb = await repo.findById(created.id);
      expect(fromDb!.name).toBe('Nombre Actualizado');
    });
  });

  describe('patch', () => {
    it('should patch only provided fields', async () => {
      const created = await aProduct()
        .withName('Nombre Original')
        .withCategory('Categoría Original')
        .withPrice(100)
        .withStock(10)
        .build(prisma);

      const patched = await repo.patch(created.id, {
        price: 250,
        stock: 50,
      });

      expect(patched.id).toBe(created.id);
      expect(patched.name).toBe('Nombre Original');
      expect(patched.category).toBe('Categoría Original');
      expect(patched.price).toBe(250);
      expect(patched.stock).toBe(50);

      // Verificar persistencia
      const fromDb = await repo.findById(created.id);
      expect(fromDb!.price).toBe(250);
      expect(fromDb!.stock).toBe(50);
    });
  });

  describe('delete', () => {
    it('should delete product from database', async () => {
      const created = await aProduct()
        .withName('Producto a Eliminar')
        .build(prisma);

      await repo.delete(created.id);

      const result = await repo.findById(created.id);
      expect(result).toBeNull();
    });
  });
});
