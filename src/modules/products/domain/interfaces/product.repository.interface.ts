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

export interface IProductRepository {
  search(filters: SearchFilters): Promise<SearchProductsResult>;
  findAllProducts(): Promise<Product[]>;
}
