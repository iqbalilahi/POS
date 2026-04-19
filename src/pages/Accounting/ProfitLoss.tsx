import React, { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip,
  Legend
} from 'recharts';

const ProfitLoss = () => {
  // Mock calculations based on typical InkPOS data
  const data = useMemo(() => ({
    revenue: 45000000,
    cogs: 18000000, // HPP (Cost of Goods Sold)
    expenses: 12000000, // Monthly operational expenses
  }), []);

  const grossProfit = data.revenue - data.cogs;
  const netProfit = grossProfit - data.expenses;
  const profitMargin = (netProfit / data.revenue) * 100;

  const chartData = [
    { name: 'COGS', value: data.cogs, color: '#000000' },
    { name: 'Expenses', value: data.expenses, color: '#4b5563' },
    { name: 'Net Profit', value: netProfit, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter">PROFIT & LOSS</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Accounting Summary • Period: April 2026</p>
        </div>
        <button className="px-6 py-3 border-2 border-black dark:border-white font-bold text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
          EXPORT REPORT (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Total Revenue</p>
          <h3 className="text-2xl font-black">{formatCurrency(data.revenue)}</h3>
          <p className="text-xs text-green-500 font-bold mt-2">+15.2% vs Last Month</p>
        </div>
        <div className="p-6 bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Gross Profit (Bruto)</p>
          <h3 className="text-2xl font-black">{formatCurrency(grossProfit)}</h3>
          <p className="text-xs text-gray-500 font-medium mt-2">Margin: {((grossProfit/data.revenue)*100).toFixed(1)}%</p>
        </div>
        <div className="p-6 bg-black text-white dark:bg-white dark:text-black shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mb-2">Net Profit (Bersih)</p>
          <h3 className="text-2xl font-black">{formatCurrency(netProfit)}</h3>
          <p className="text-xs opacity-70 font-bold mt-2">Target reached: 88%</p>
        </div>
        <div className="p-6 bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Net Margin %</p>
          <h3 className="text-2xl font-black">{profitMargin.toFixed(1)}%</h3>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 mt-4">
            <div className="bg-black dark:bg-white h-full" style={{ width: `${profitMargin}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Calculator size={20} /> DETAILED INCOME STATEMENT
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-900">
              <span className="text-sm font-medium">Sales Revenue</span>
              <span className="font-bold">{formatCurrency(data.revenue)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-900 text-red-500">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Cost of Goods Sold (HPP)</span>
                <span className="text-[10px] opacity-70">Printing Materials + Inventory Costs</span>
              </div>
              <span className="font-bold">({formatCurrency(data.cogs)})</span>
            </div>
            <div className="flex justify-between items-center py-4 text-lg font-black border-y-2 border-black dark:border-white">
              <span>GROSS PROFIT</span>
              <span>{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-900 text-gray-500">
              <span className="text-sm font-medium">Operational Expenses</span>
              <span className="font-bold">({formatCurrency(data.expenses)})</span>
            </div>
            <div className="flex justify-between items-center pt-4 text-2xl font-black">
              <span className="tracking-tighter italic">NET EARNINGS</span>
              <span className="text-green-600">{formatCurrency(netProfit)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-8">
          <h3 className="font-bold text-lg mb-6">COST DISTRIBUTION</h3>
          <div className="h-[250px] w-full">
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
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border-l-4 border-black dark:border-white">
            <p className="text-xs text-gray-500 italic">"Production costs remain the highest contributor to COGS. Material waste reduction advised."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
