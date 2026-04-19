import React, { useMemo } from 'react';
import { Package, BarChart, HardDrive, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { InventoryValuationItem } from '@/types';

const MOCK_INVENTORY: InventoryValuationItem[] = [
  { product_id: '1', name: 'Ink Cartridge XL', sku: 'INK-001', stock: 45, base_price: 350000, total_value: 15750000 },
  { product_id: '2', name: 'Matte Paper A4', sku: 'PAP-001', stock: 120, base_price: 45000, total_value: 5400000 },
  { product_id: '3', name: 'Glossy Vinyl Roll', sku: 'VIN-005', stock: 12, base_price: 1200000, total_value: 14400000 },
  { product_id: '4', name: 'Standard Toner Blue', sku: 'TON-002', stock: 8, base_price: 850000, total_value: 6800000 },
];

const InventoryValuation = () => {
  const totalValue = useMemo(() => MOCK_INVENTORY.reduce((sum, item) => sum + item.total_value, 0), []);
  const totalStock = useMemo(() => MOCK_INVENTORY.reduce((sum, item) => sum + item.stock, 0), []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Valuation</h2>
          <p className="text-gray-500 text-sm">Asset tracking based on HPP (Base Price)</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">Grand Total Value</p>
          <h3 className="text-4xl font-black text-black dark:text-white">{formatCurrency(totalValue)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-black text-white dark:bg-white dark:text-black">
          <Package className="mb-4" size={32} />
          <p className="text-xs opacity-60 uppercase font-bold tracking-widest mb-1">Total Items In Stock</p>
          <h4 className="text-3xl font-black">{totalStock} <span className="text-sm font-medium opacity-60">Units</span></h4>
        </div>
        <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 border-l-[12px] border-l-black dark:border-l-white">
          <BarChart className="mb-4 text-gray-400" size={32} />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Asset Distribution</p>
          <h4 className="text-3xl font-black">12 <span className="text-sm font-medium text-gray-500">Categories</span></h4>
        </div>
        <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
          <HardDrive className="mb-4 text-gray-400" size={32} />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Warehouse Capacity</p>
          <h4 className="text-3xl font-black">74% <span className="text-sm font-medium text-gray-500">Occupied</span></h4>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
        <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center">
          <h3 className="font-bold tracking-tight">DETAILED ASSET LIST</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-widest">All Branches</span>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">ID / SKU</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Name</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Stock</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">HPP (Base)</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Value Asset</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
            {MOCK_INVENTORY.map((item) => (
              <tr key={item.product_id} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {item.sku}
                </td>
                <td className="px-6 py-4 text-sm font-semibold uppercase">{item.name}</td>
                <td className="px-6 py-4 text-sm text-center font-mono">{item.stock}</td>
                <td className="px-6 py-4 text-sm text-right text-gray-500">{formatCurrency(item.base_price)}</td>
                <td className="px-6 py-4 text-sm text-right font-black">{formatCurrency(item.total_value)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-950 border-t-2 border-black dark:border-white">
              <td colSpan={4} className="px-6 py-4 text-sm font-black text-right uppercase tracking-widest">Total Inventory Value</td>
              <td className="px-6 py-4 text-lg font-black text-right">{formatCurrency(totalValue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 flex items-center gap-4">
        <ArrowRight className="text-yellow-500 animate-pulse" />
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          <strong>Accounting Tip:</strong> Inventory valuation is calculated using FIFO methodology. Ensure all stock adjustments are logged before end-of-month closing.
        </p>
      </div>
    </div>
  );
};

export default InventoryValuation;
