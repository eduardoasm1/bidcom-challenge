import { Product } from '../entities/product.entity';

export interface SearchFilters {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  limit: number;
  offset: number;
}

export interface SearchProductsResult {
  total: number;
  items: Product[];
}

export interface CreateProductData {
  name: string;
  description?: string | null;
  category: string;
  brand: string;
  price: number;
  stock: number;
}

export interface IProductRepository {
  search(filters: SearchFilters): Promise<SearchProductsResult>;
  findAllProducts(): Promise<Product[]>;
  create(data: CreateProductData): Promise<Product>;
}
