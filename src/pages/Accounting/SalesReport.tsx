import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, 
  Download, 
  Calendar as CalendarIcon,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

const SalesReport = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/sales');
      setSales(data.data);
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSales();
    };
    init();
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter(s => 
      s.sale_number.toLowerCase().includes(filter.toLowerCase()) ||
      s.customer_name?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [sales, filter]);

  const stats = useMemo(() => {
    const total = filteredSales.reduce((sum, s) => sum + s.grand_total, 0);
    const count = filteredSales.length;
    const avg = count > 0 ? total / count : 0;
    const cash = filteredSales.filter(s => s.payment_method === 'cash').reduce((sum, s) => sum + s.grand_total, 0);
    const credit = filteredSales.filter(s => s.payment_method === 'credit').reduce((sum, s) => sum + s.grand_total, 0);
    
    return { total, count, avg, cash, credit };
  }, [filteredSales]);

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
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Sales Transactions Report</h2>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Historical revenue and transaction tracking</p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Gross Sales</p>
          <p className="text-2xl font-black tabular-nums">{formatCurrency(stats.total)}</p>
        </div>
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Transaction Count</p>
          <p className="text-2xl font-black tabular-nums">{stats.count}</p>
        </div>
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6 border-l-[12px] border-l-black dark:border-l-white">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Average AOVs</p>
          <p className="text-2xl font-black tabular-nums">{formatCurrency(stats.avg)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-900">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Method Mix</span>
           </div>
           <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                 <span className="flex items-center gap-1"><CreditCard size={10}/> Cash</span>
                 <span>{formatCurrency(stats.cash)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                 <span className="flex items-center gap-1"><Wallet size={10}/> Credit</span>
                 <span>{formatCurrency(stats.credit)}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
        <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by invoice or customer name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-none outline-none text-[10px] font-black uppercase tracking-widest"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none px-4 py-3 bg-gray-100 dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <CalendarIcon size={14}/> April 2026
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Invoice</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Date/Time</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Method</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Revenue</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-all group">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-black tracking-tight">{sale.sale_number}</span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                    {format(new Date(sale.created_at), 'dd MMM yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-[11px] font-black uppercase tracking-tight">{sale.customer_name || 'WALK-IN'}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border",
                      sale.payment_method === 'cash' ? "border-green-200 text-green-700 bg-green-50" : "border-blue-200 text-blue-700 bg-blue-50"
                    )}>
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-black text-right tabular-nums">{formatCurrency(sale.grand_total)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                       <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
