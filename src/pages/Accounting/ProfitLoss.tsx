import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

const ProfitLoss = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/sales');
      setSales(data.data);
    } catch (error) {
      console.error('Failed to fetch sales for P&L:', error);
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

  const totals = useMemo(() => {
    const revenue = sales.reduce((sum, s) => sum + s.grand_total, 0);
    const cogs = sales.reduce((sum, s) => sum + (s.cogs_total || 0), 0);
    const expenses = 450000; // Mock fixed expenses
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - expenses;
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return { revenue, cogs, grossProfit, expenses, netProfit, margin };
  }, [sales]);

  const chartData = [
    { name: 'COGS', value: totals.cogs, color: '#000000' },
    { name: 'Expenses', value: totals.expenses, color: '#666666' },
    { name: 'Net Profit', value: totals.netProfit > 0 ? totals.netProfit : 0, color: '#999999' },
  ];

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
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Profit & Loss Statement</h2>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase text-sky-500">Income and Expenditure Summary • Live Integration</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Net Profit Margin</p>
              <div className="flex items-center justify-end gap-2">
                 <h4 className="text-3xl font-black tabular-nums">{totals.margin.toFixed(1)}%</h4>
                 {totals.margin > 0 ? <TrendingUp className="text-green-500" size={24} /> : <TrendingDown className="text-red-500" size={24} />}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-2xl font-black tabular-nums">{formatCurrency(totals.revenue)}</p>
        </div>
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">COGS (HPP)</p>
          <p className="text-2xl font-black tabular-nums text-gray-400">-{formatCurrency(totals.cogs)}</p>
        </div>
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6 border-l-[12px] border-l-black dark:border-l-white">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Gross Profit</p>
          <p className="text-2xl font-black tabular-nums">{formatCurrency(totals.grossProfit)}</p>
        </div>
        <div className="bg-black text-white dark:bg-white dark:text-black p-6 shadow-xl">
          <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mb-1">Net Earnings</p>
          <p className="text-2xl font-black tabular-nums italic">{formatCurrency(totals.netProfit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-400 border-b border-gray-50 dark:border-gray-950 pb-4 flex justify-between items-center">
             Financial Trend Analysis <span>Last 30 Days</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sales.map((s, i) => ({ name: `Day-${i+1}`, val: s.grand_total }))}>
                <defs>
                   <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="1 1" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '0', padding: '12px' }}
                   itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="step" dataKey="val" stroke="#000" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-400 border-b border-gray-50 dark:border-gray-950 pb-4">Budget Extraction</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
             {chartData.map(item => (
               <div key={item.name} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-gray-50 dark:border-gray-900 pb-2">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5" style={{ backgroundColor: item.color }} />
                     <span>{item.name}</span>
                  </div>
                  <span>{totals.revenue > 0 ? ((item.value / totals.revenue) * 100).toFixed(1) : 0}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-950 p-8 border border-gray-100 dark:border-gray-900 border-l-[12px] border-l-black dark:border-l-white shadow-2xl">
         <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 italic">Accounting Ledger Breakdown</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[11px]">
            <div className="space-y-6">
               <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-gray-400 tracking-widest uppercase">Operating Revenue</span>
                  <span className="font-black tabular-nums">{formatCurrency(totals.revenue)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-gray-400 tracking-widest uppercase">Cost of Sales (COGS)</span>
                  <span className="font-black tabular-nums text-gray-400">({formatCurrency(totals.cogs)})</span>
               </div>
               <div className="flex justify-between items-center py-4 border-b-2 border-black dark:border-white font-black text-sm">
                  <span className="italic">GROSS EARNINGS</span>
                  <span className="tabular-nums tracking-tighter">{formatCurrency(totals.grossProfit)}</span>
               </div>
            </div>
            <div className="space-y-6">
               <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-gray-400 tracking-widest uppercase">Fixed Operational Expenses</span>
                  <span className="font-black tabular-nums text-gray-400">({formatCurrency(totals.expenses)})</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-bold text-gray-400 tracking-widest uppercase">Tax Provisions</span>
                  <span className="font-black tabular-nums">IDR 0,00</span>
               </div>
               <div className="flex justify-between items-center py-6 bg-black text-white dark:bg-white dark:text-black px-4 text-xl font-black italic shadow-xl">
                  <span>NET P&L</span>
                  <span className="tabular-nums tracking-tighter">{formatCurrency(totals.netProfit)}</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
