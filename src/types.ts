export interface BaseEntity {
  id: number;
  created_at: string;
  created_by?: string;
  updated_at: string;
  updated_by?: string;
  is_active: boolean;
}

export interface Branch extends BaseEntity {
  company_id: number;
  branch_code: string;
  branch_name: string;
  branch_type?: string;
  address?: string;
  city?: string;
  is_main_branch: boolean;
}

export interface Category extends BaseEntity {
  company_id: number;
  name: string;
  code?: string;
  sort: number;
}

export interface Unit extends BaseEntity {
  company_id: number;
  name: string;
  symbol: string;
}

export interface Product extends BaseEntity {
  company_id: number;
  category_id?: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  product_type: 'sell' | 'service'; // sell for retail, service for printing
  unit_id?: number;
  buy_price: number;
  sell_price: number;
  track_stock: boolean;
  min_stock: number;
  image_url?: string;
}

export interface Customer extends BaseEntity {
  company_id: number;
  branch_id?: number;
  customer_code?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  customer_type: string;
  points: number;
  total_spent: number;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  unit_price: number;
  discount: number;
  subtotal: number;
  notes?: string;
}

export type OrderItem = SaleItem;

export interface Sale extends BaseEntity {
  company_id: number;
  branch_id: number;
  sale_number: string;
  customer_id?: number;
  customer_name?: string;
  cashier_id: number;
  grand_total: number;
  status: string;
  payment_method: string;
}

export interface ProductionJob extends BaseEntity {
  order_id: number;
  job_number: string;
  operator_name?: string;
  status: 'pending' | 'processing' | 'done' | 'qc';
  priority: number;
}

export interface ProfitLossData {
  revenue: number;
  cogs: number;
  gross_profit: number;
  expenses: number;
  net_profit: number;
}

export interface InventoryValuationItem {
  product_id: number;
  name: string;
  sku: string;
  stock: number;
  base_price: number;
  total_value: number;
}

export interface Params {
  page?: number;
  per_page?: number;
  search?: string;
  order?: string | string[];
  direction?: string | string[];
  between?: string;
  filter?: string;
  filterAnd?: string;
  filterExact?: string;
  filterAndNegative?: string;
}

export interface Pagination {
  data: any[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  from: number;
  to: number;
}
