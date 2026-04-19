import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Printer, 
  ClipboardCheck, 
  BarChart2, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Layers,
  Database
} from 'lucide-react';

const BusinessProcess = () => {
  const steps = [
    {
      id: "01",
      title: "ORDER ENTRY (POS/CS)",
      desc: "Transaksi dimulai lewat Kasir Retail (POS) atau Order Printing. Database mencatat Customer ID dan detail item.",
      icon: <ShoppingCart size={20} />,
      status: "CORE"
    },
    {
      id: "02",
      title: "QUEUEING & PICKING",
      desc: "Pesanan masuk ke antrian produksi (Printing) atau pengemasan (Retail). Stok bahan baku (kertas/tinta) dipotong otomatis.",
      icon: <Printer size={20} />,
      status: "PRODUCTION"
    },
    {
      id: "03",
      title: "QUALITY CONTROL & FINISHING",
      desc: "Operator melakukan pengecekan kualitas sesuai 'Step Templates'. Status berubah menjadi 'Ready for Pickup'.",
      icon: <ClipboardCheck size={20} />,
      status: "QC"
    },
    {
      id: "04",
      title: "DELIVERY & SETTLEMENT",
      desc: "Customer mengambil barang. Closing transaksi memicu update laporan Profit & Loss harian.",
      icon: <BarChart2 size={20} />,
      status: "FINANCE"
    }
  ];

  const roadmap = [
    {
      phase: "PHASE 1",
      title: "FOUNDATION",
      priority: "CRITICAL",
      items: ["Standardisasi Master Products", "Master Customer CRM", "Unit of Measurement (m2/pcs)", "Database Architecture"]
    },
    {
      phase: "PHASE 2",
      title: "CORE REVENUE",
      priority: "HIGH",
      items: ["POS Retail Implementation", "Printing Order Entry", "Payment Channels (QRIS/Cash)", "Receipt Printing"]
    },
    {
      phase: "PHASE 3",
      title: "OPERATIONAL",
      priority: "MEDIUM",
      items: ["Live Queue Management", "Step Templates Workflow", "Cashier Shift Management", "Production Monitor"]
    },
    {
      phase: "PHASE 4",
      title: "ANALYTICS",
      priority: "LOW",
      items: ["Profit & Loss Reports", "Inventory Valuation", "Stock Opname Audit", "Performance Dashboard"]
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">InkPOS Business Engine</h2>
        <p className="text-gray-500 font-bold tracking-widest text-xs uppercase underline underline-offset-8 decoration-2">End-to-End Workflow & Development Roadmap</p>
      </section>

      {/* Flowchart SVG Section */}
      <section className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900 p-10 overflow-hidden relative">
        <div className="absolute top-4 right-6 text-[10px] font-black text-gray-300 dark:text-gray-800 tracking-[0.5em] uppercase pointer-events-none">Flow Architecture</div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 font-mono">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full lg:w-64 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 relative group"
              >
                <div className="text-[10px] font-black text-gray-400 mb-2">{step.id}</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-black text-white dark:bg-white dark:text-black">
                    {step.icon}
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-tighter leading-none">{step.title}</div>
                </div>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase">{step.desc}</p>
                <div className="mt-4 flex justify-between items-center">
                   <span className="text-[9px] font-black px-2 py-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">{step.status}</span>
                   <Zap size={10} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block text-gray-300 dark:text-gray-800">
                  <ArrowRight size={24} />
                </div>
              )}
              {idx < steps.length - 1 && (
                <div className="lg:hidden h-8 w-px bg-gray-200 dark:bg-gray-800 mx-auto" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Development Priority Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roadmap.map((item, idx) => (
          <div key={idx} className="border border-gray-100 dark:border-gray-900 p-6 space-y-4 hover:bg-white dark:hover:bg-black transition-all">
            <div className="flex justify-between items-start">
               <span className="font-mono text-[10px] text-gray-400">{item.phase}</span>
               <span className={`text-[9px] font-black px-2 py-0.5 ${
                 item.priority === 'CRITICAL' ? 'bg-red-100 text-red-600' : 
                 item.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' : 
                 item.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
               }`}>
                 {item.priority}
               </span>
            </div>
            <div>
              <h4 className="text-xl font-black italic tracking-tighter uppercase">{item.title}</h4>
            </div>
            <ul className="space-y-3 pt-4 border-t border-gray-50 dark:border-gray-950">
              {item.items.map((task, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 group">
                  <div className="w-1 h-1 bg-black dark:bg-white rounded-full group-hover:scale-150 transition-transform" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Strategic Implementation Advice */}
      <section className="bg-black text-white dark:bg-white dark:text-black p-10 rounded-none relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-6 flex items-center gap-4">
            <Layers /> WHAT SHOULD YOU DO FIRST?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400">1. Master Data Stability</p>
              <p className="text-sm font-medium leading-relaxed">
                Sebelum membangun transaksi, pastikan Master <span className="underline">Product</span> dan <span className="underline">UoM</span> sudah matang. Tanpa kalkulasi m2 (untuk printing) dan SKU (untuk retail) yang stabil, laporan Profit & Loss tidak akan akurat.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500">
                <Database size={14} /> STATUS: IN PROGRESS (PHASE 1)
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400">2. Core Transaction (POS)</p>
              <p className="text-sm font-medium leading-relaxed">
                Fokuslah menghidupkan modul <span className="underline">POS</span>. Ini adalah "Jantung" pendapatan. Selesaikan alur belanja hingga cetak struk sebelum pindah ke fitur kompleks seperti manajemen antrian atau akuntansi.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500">
                <CheckCircle2 size={14} className="text-green-500" /> RECOMMENDED NEXT STEP
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 uppercase font-black text-9xl tracking-tighter overflow-hidden select-none">
          SYSTEM
        </div>
      </section>
    </div>
  );
};

export default BusinessProcess;
