import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const MOCK_STATS = [
  { title: 'Total Revenue', value: 125430000, icon: TrendingUp, trend: '+12.5%', color: 'black' },
  { title: 'New Orders', value: 245, icon: ShoppingBag, trend: '+8.2%', color: 'black' },
  { title: 'Active Customers', value: 1240, icon: Users, trend: '+2.4%', color: 'black' },
  { title: 'Production Jobs', value: 42, icon: Printer, trend: '-4.1%', color: 'black' },
];

const MOCK_CHART_DATA = [
  { name: 'Mon', revenue: 4000, jobs: 24 },
  { name: 'Tue', revenue: 3000, jobs: 13 },
  { name: 'Wed', revenue: 2000, jobs: 98 },
  { name: 'Thu', revenue: 2780, jobs: 39 },
  { name: 'Fri', revenue: 1890, jobs: 48 },
  { name: 'Sat', revenue: 2390, jobs: 38 },
  { name: 'Sun', revenue: 3490, jobs: 43 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-1">Overview</p>
          <h2 className="text-4xl font-black tracking-tighter">GOOD MORNING, ADMIN.</h2>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono text-gray-400">APRIL 19, 2026</p>
          <p className="text-xs text-green-500 font-bold">SYSTEM ONLINE</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
          <div key={stat.title} className="p-6 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 group transition-all hover:border-black dark:hover:border-white">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                <stat.icon size={20} />
              </div>
              <span className={cn(
                "text-xs font-bold font-mono px-2 py-1 flex items-center gap-1",
                stat.trend.startsWith('+') ? "text-green-500" : "text-red-500"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{stat.title}</p>
            <h3 className="text-2xl font-black tracking-tighter">
              {typeof stat.value === 'number' && stat.title.includes('Revenue') ? formatCurrency(stat.value) : stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 bg-white dark:bg-black border border-gray-100 dark:border-gray-900">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight">REVENUE PERFORMANCE</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <div className="w-3 h-3 bg-black dark:bg-white" /> Revenue
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ 
                    border: '1px solid #000', 
                    borderRadius: '0px',
                    boxShadow: '10px 10px 0px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="revenue" fill="#000000" radius={[0, 0, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-black text-white dark:bg-white dark:text-black">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight uppercase">Recent Jobs</h3>
            <button className="text-xs hover:underline flex items-center gap-1">SEE ALL <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 border-b border-white/10 dark:border-black/10 pb-4 last:border-0 last:pb-0">
                <div className="w-10 h-10 border border-white/20 dark:border-black/20 flex items-center justify-center font-mono text-xs">
                  #0{i}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold uppercase truncate">Banner - Digital Print</h4>
                    <span className="text-[10px] bg-white/10 dark:bg-black/10 px-2 py-0.5 font-bold tracking-widest">IN QUEUE</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 uppercase">Customer: Digital Print Shop</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default Dashboard;
