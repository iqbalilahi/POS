export interface Product {
  id: string;
  name: string;
  category_id: string;
  sku: string;
  barcode?: string;
  type: 'printing' | 'retail';
  unit_id: string;
  base_price: number; // HPP
  sell_price: number;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  debt_limit: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  notes?: string;
  is_printing: boolean;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number;
  change_amount: number;
  payment_method_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  created_at: string;
  branch_id: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  is_main: boolean;
}

export interface ProfitLossData {
  revenue: number;
  cogs: number; // HPP
  gross_profit: number;
  expenses: number;
  net_profit: number;
}

export interface SalesReportItem {
  date: string;
  count: number;
  total: number;
}

export interface InventoryValuationItem {
  product_id: string;
  name: string;
  sku: string;
  stock: number;
  base_price: number;
  total_value: number;
}
