import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-800"
    >
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-gray-400" />
      </div>
      <h2 className="text-3xl font-black italic tracking-tighter mb-2">{pageName || 'PAGE'}</h2>
      <p className="text-gray-500 uppercase tracking-widest text-xs font-bold max-w-md">
        This module is currently under development based on the database schema analysis.
      </p>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-widest">
          Database Linked
        </div>
        <div className="px-4 py-2 border border-black dark:border-white text-[10px] font-bold uppercase tracking-widest">
          Schema: READY
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceholderPage;
