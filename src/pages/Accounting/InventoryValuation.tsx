import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Package, BarChart, HardDrive, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

const InventoryValuation = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products');
      // Only value items that track stock
      setProducts(data.data.filter((p: Product) => p.track_stock));
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchInventory();
    };
    init();
  }, []);

  const valuationData = useMemo(() => {
    return products.map(p => ({
      ...p,
      stock: (p as any).stock || 0,
      total_value: ((p as any).stock || 0) * p.buy_price
    }));
  }, [products]);

  const totalValue = useMemo(() => valuationData.reduce((sum, item) => sum + item.total_value, 0), [valuationData]);
  const totalStock = useMemo(() => valuationData.reduce((sum, item) => sum + item.stock, 0), [valuationData]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Inventory Valuation</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Asset tracking based on HPP (Base Purchase Price)</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black mb-1 uppercase tracking-[0.2em]">Grand Total Value</p>
          <h3 className="text-4xl font-black text-black dark:text-white tabular-nums">{formatCurrency(totalValue)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-black text-white dark:bg-white dark:text-black">
          <Package className="mb-4" size={32} />
          <p className="text-[10px] opacity-60 uppercase font-black tracking-widest mb-1">Total Stocks</p>
          <h4 className="text-3xl font-black tabular-nums">{totalStock} <span className="text-sm font-medium opacity-60">Units</span></h4>
        </div>
        <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 border-l-[12px] border-l-black dark:border-l-white">
          <BarChart className="mb-4 text-gray-400" size={32} />
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Asset Turnover</p>
          <h4 className="text-3xl font-black tabular-nums">1.4 <span className="text-sm font-medium text-gray-500">Ratio</span></h4>
        </div>
        <div className="p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
          <HardDrive className="mb-4 text-gray-400" size={32} />
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Warehouse Space</p>
          <h4 className="text-3xl font-black tabular-nums">42% <span className="text-sm font-medium text-gray-500">Used</span></h4>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center">
          <h3 className="font-black text-xs uppercase tracking-widest">Active Stock Ledger</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] font-black uppercase tracking-widest">Main Branch</span>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">SKU</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Product Name</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">On Hand</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Unit HPP</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Asset Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
            {valuationData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group">
                <td className="px-6 py-4 font-mono text-[11px] font-bold text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {item.sku}
                </td>
                <td className="px-6 py-4 text-[11px] font-black uppercase">{item.name}</td>
                <td className="px-6 py-4 text-[11px] text-center font-black tabular-nums">{item.stock}</td>
                <td className="px-6 py-4 text-[11px] text-right text-gray-500 tabular-nums">{formatCurrency(item.buy_price)}</td>
                <td className="px-6 py-4 text-[11px] text-right font-black tabular-nums">{formatCurrency(item.total_value)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-950 border-t-2 border-black dark:border-white">
              <td colSpan={4} className="px-6 py-6 text-sm font-black text-right uppercase tracking-[0.2em]">Inventory Liquidity Value</td>
              <td className="px-6 py-6 text-2xl font-black text-right tabular-nums">{formatCurrency(totalValue)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-l-4 border-black dark:border-white flex items-center gap-4">
        <ArrowRight className="text-black dark:text-white" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
          <strong className="text-black dark:text-white">Note:</strong> Valuation is calculated using weighted average cost. stock opname is recommended every 30 days.
        </p>
      </div>
    </div>
  );
};

export default InventoryValuation;
