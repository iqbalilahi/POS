import React, { useState, useEffect } from "react";
import { X, Filter, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FilterItem {
  field: string;
  operator: string;
  value: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterItem[]) => void;
  fields: { label: string; value: string; type?: string }[];
  filterButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  fields,
}) => {
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);

  const operators = [
    { label: 'Equals', value: 'equals' },
    { label: 'Contains', value: 'contains' },
    { label: 'Not Equals', value: 'not_equals' },
  ];

  const addFilter = () => {
    setActiveFilters([...activeFilters, { field: fields[0]?.value || '', operator: 'contains', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, key: keyof FilterItem, val: string) => {
    const newFilters = [...activeFilters];
    newFilters[index] = { ...newFilters[index], [key]: val };
    setActiveFilters(newFilters);
  };

  const handleApply = () => {
    onApply(activeFilters.filter(f => f.value.trim() !== ''));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-black border border-gray-100 dark:border-gray-900 shadow-2xl z-[101] overflow-hidden rounded-2xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-gray-950/50">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Advanced Filters</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {activeFilters.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">No active filters</p>
                </div>
              ) : (
                activeFilters.map((filter, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-xl group">
                    <select
                      value={filter.field}
                      onChange={(e) => updateFilter(index, 'field', e.target.value)}
                      className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-bold p-2 outline-none uppercase tracking-wider"
                    >
                      {fields.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                      className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-bold p-2 outline-none uppercase tracking-wider"
                    >
                      {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                    </select>
                    <input
                      type="text"
                      value={filter.value}
                      onChange={(e) => updateFilter(index, 'value', e.target.value)}
                      placeholder="Filter value..."
                      className="flex-1 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-[10px] font-bold p-2 outline-none"
                    />
                    <button 
                      onClick={() => removeFilter(index)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}

              <button 
                onClick={addFilter}
                className="w-full py-4 border border-dashed border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Filter Logic
              </button>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-900 flex gap-3 bg-gray-50/50 dark:bg-gray-950/50">
              <button 
                onClick={() => setActiveFilters([])}
                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all"
              >
                Reset All
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] py-3 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
