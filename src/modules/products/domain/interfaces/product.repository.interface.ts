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

export interface UpdateProductData {
  name: string;
  description?: string | null;
  category: string;
  brand: string;
  price: number;
  stock: number;
}

export interface PatchProductData {
  name?: string;
  description?: string | null;
  category?: string;
  brand?: string;
  price?: number;
  stock?: number;
}

export interface IProductRepository {
  search(filters: SearchFilters): Promise<SearchProductsResult>;
  findAllProducts(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductData): Promise<Product>;
  update(id: string, data: UpdateProductData): Promise<Product>;
  patch(id: string, data: PatchProductData): Promise<Product>;
}
