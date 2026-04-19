import React, { useRef } from 'react';
import axios from 'axios';
import { Product, Params } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Package, Edit2 } from 'lucide-react';
import { MTable } from '@/components/MTable';

const Products = () => {
  const tableRef = useRef<any>(null);

  const fetchProducts = async (params: Params) => {
    const { data } = await axios.get('/api/products', { params });
    return data;
  };

  const columns = [
    {
      field: 'name',
      header: 'Product Info',
      sortable: true,
      filterable: true,
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400">
            <Package size={20} />
          </div>
          <div>
            <div className="font-black text-[11px] tracking-tight uppercase">{product.name}</div>
            <div className="font-mono text-[9px] text-gray-400 font-bold">{product.sku}</div>
          </div>
        </div>
      )
    },
    {
      field: 'product_type',
      header: 'Catalog Type',
      sortable: true,
      filterable: true,
      render: (product: Product) => (
        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-tighter ${product.product_type === 'service' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'}`}>
          {product.product_type === 'service' ? 'PRINTING' : 'RETAIL'}
        </span>
      )
    },
    {
      field: 'sell_price',
      header: 'Price',
      sortable: true,
      render: (product: Product) => (
        <div className="font-black text-[11px]">{formatCurrency(product.sell_price)}</div>
      )
    },
    {
      field: 'stock',
      header: 'Inventory',
      sortable: true,
      render: (product: Product) => (
        <div>
          {product.track_stock ? (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${ (product as any).stock < (product as any).min_stock ? 'bg-red-500 animate-pulse' : 'bg-green-500' }`} />
              <span className="font-bold text-[11px] tabular-nums">{(product as any).stock} Units</span>
            </div>
          ) : (
            <span className="text-[9px] text-gray-400 font-bold italic uppercase">N/A Service</span>
          )}
        </div>
      )
    },
    {
      field: 'actions',
      header: 'Action',
      render: (product: Product) => (
        <div className="flex justify-end gap-2">
          <button 
            className="p-2 border border-gray-100 dark:border-gray-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            title="Edit Product"
          >
            <Edit2 size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <MTable
        ref={tableRef}
        title="Product Master Catalog"
        columns={columns}
        getData={fetchProducts}
        enableButton={true}
        buttonText="New Product"
        onAddData={() => alert("Redirect to Add Product Form")}
        placeholderSearch="Search SKU / Name..."
        showIndex={true}
      />
    </div>
  );
};

export default Products;
