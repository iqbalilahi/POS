import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductionJob } from '@/types';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  User,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const PrintingOrder = () => {
  const [jobs, setJobs] = useState<ProductionJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/production_jobs');
      setJobs(data.data);
    } catch (error) {
      console.error('Failed to fetch production jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchJobs();
    };
    init();
  }, []);

  const statusConfig = {
    pending: { label: 'Waiting', icon: Clock, color: 'text-gray-400 bg-gray-50 border-gray-100 dark:bg-gray-950 dark:border-gray-900' },
    processing: { label: 'Printing', icon: Play, color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30' },
    qc: { label: 'Quality Control', icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/30' },
    done: { label: 'Finished', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30' },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Production Queue</h2>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Monitor real-time printing operations</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-widest">
             ACTIVE JOBS: {jobs.filter(j => j.status !== 'done').length}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing with factory...</div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">No active production jobs</div>
        ) : jobs.map((job, idx) => {
          const config = statusConfig[job.status] || statusConfig.pending;
          return (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-black dark:hover:border-white transition-all group"
            >
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-gray-50 dark:bg-gray-950 flex items-center justify-center border border-gray-100 dark:border-gray-900">
                    <Layers className="text-gray-400" size={20} />
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="font-black text-sm tracking-tight uppercase">{job.job_number}</span>
                       <span className={`text-[8px] font-black px-1.5 py-0.5 border ${config.color.split(' ')[2]} ${config.color.split(' ')[0]} uppercase tracking-widest`}>
                         PRIORITY: {job.priority === 2 ? 'HIGH' : job.priority === 1 ? 'NORMAL' : 'LOW'}
                       </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order Ref: #{job.order_id}</p>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <User size={14} className="text-gray-400" />
                   </div>
                   <div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Operator</div>
                      <div className="text-[10px] font-black uppercase">{job.operator_name || 'UNASSIGNED'}</div>
                   </div>
                </div>

                <div className={cn("flex items-center gap-3 px-4 py-3 border min-w-[160px]", config.color)}>
                   <config.icon size={18} />
                   <div className="font-black text-[10px] uppercase tracking-widest">{config.label}</div>
                </div>

                <button className="p-3 border border-gray-100 dark:border-gray-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                   <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 p-4">
            <div className="flex items-center gap-2 mb-2">
              <config.icon size={14} className={config.color.split(' ')[0]} />
              <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
            </div>
            <div className="text-2xl font-black italic">{jobs.filter(j => j.status === status).length}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintingOrder;
