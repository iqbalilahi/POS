import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Database, 
  Settings, 
  Users, 
  BarChart, 
  ClipboardList, 
  TrendingUp, 
  Info,
  Clock,
  Layers,
  FileText
} from 'lucide-react';

interface ModuleInfo {
  description: string;
  workflow: string[];
  inputs: string[];
  icon: any;
}

const moduleRegistry: Record<string, ModuleInfo> = {
  'queue-services': {
    icon: Clock,
    description: "Layanan Antrian Cetak: Mendefinisikan durasi rata-rata dan jenis layanan (Express vs Standard) untuk manajemen antrian produksi.",
    workflow: ["Input jenis layanan", "Set estimasi waktu per m2", "Mapping ke printer spesifik"],
    inputs: ["Nama Layanan", "Waktu Pengerjaan (menit)", "Harga per Menit/m2", "Printer ID"]
  },
  'step-templates': {
    icon: Layers,
    description: "Template Alur Kerja: Standarisasi instruksi pengerjaan per produk (e.g. Desain -> Cetak -> Laminating -> Potong).",
    workflow: ["Buat urutan langkah", "Set penanggung jawab tiap tahap", "Simpan sebagai template produk"],
    inputs: ["Nama Template", "Daftar Langkah (Array)", "Instruksi Khusus", "Target Waktu per Langkah"]
  },
  'doc-numbering': {
    icon: Settings,
    description: "Penomoran Dokumen: Konfigurasi prefix dan suffix otomatis untuk Invoice, PO, dan Surat Jalan (e.g. INV/2026/001).",
    workflow: ["Set prefix per tipe dokumen", "Reset counter bulanan/tahunan", "Test preview format"],
    inputs: ["Modul (PO/Sales/Refund)", "Format Prefix", "Format Suffix", "Mulai dari Nomor"]
  },
  'categories': {
    icon: Database,
    description: "Kategori Produk: Mengelompokkan inventory dan jasa untuk kemudahan filtering dan laporan laba rugi per divisi.",
    workflow: ["Input nama kategori", "Set kode unik", "Urutkan tampilan di POS"],
    inputs: ["Nama Kategori", "Kode Kategori", "Urutan Tampil (Sort Order)", "Status Aktif"]
  },
  'units': {
    icon: Database,
    description: "Satuan Ukur (UoM): Manajemen unit penjualan baik qty (pcs, box) maupun ukuran luas (m, cm).",
    workflow: ["Definisikan unit dasar", "Check mapping ke stok produk"],
    inputs: ["Nama Satuan (Meter/Pcs)", "Simbol (m/pcs)", "Tipe (Count/Measurement)"]
  },
  'suppliers': {
    icon: Users,
    description: "Master Supplier: Database produsen bahan baku/kertas untuk management Purchase Order (PO).",
    workflow: ["Input data vendor", "Mapping produk yang sering dibeli", "Track history hutang"],
    inputs: ["Nama Vendor", "Alamat Gedung", "Contact Person (WA/Email)", "No Rekening Vendor"]
  },
  'manage': { // Queue Manage
    icon: ClipboardList,
    description: "Monitor Antrian Real-time: Dashboard operator untuk memantau beban kerja mesin dan mengubah status produksi.",
    workflow: ["Lihat pesanan masuk", "Tentukan mesin cetak", "Update status: Processing -> QC -> Selesai"],
    inputs: ["Pilih Mesin/Operator", "Update Progress (%)", "Validasi Kualitas (QC Pass)"]
  },
  'display': { // Queue Display
    icon: TrendingUp,
    description: "Layar Informasi Pelanggan: Tampilan antrian di ruang tunggu yang menunjukkan nomor order yang sedang dikerjakan.",
    workflow: ["Tampilkan Nama Pelanggan", "Status (Cetak/Potong)", "Estimasi ambil"],
    inputs: ["Refresh Rate (ms)", "Daftar Antrian Aktif", "Notifikasi Suara Call Order"]
  },
  'purchase-orders': {
    icon: FileText,
    description: "Pengadaan Barang: Pembuatan order ke supplier untuk pengisian stok bahan baku percetakan.",
    workflow: ["Pilih Supplier", "Input Item & Harga Beli", "Keluarkan Dokumen PO"],
    inputs: ["Supplier ID", "Expected Delivery Date", "List Items (Kertas/Tinta)", "Total Harga PO"]
  },
  'refunds': {
    icon: FileText,
    description: "Retur Penjualan: Pencatatan pengembalian dana atau barang bagi pelanggan yang kurang puas.",
    workflow: ["Pilih Nomor Invoice", "Validasi Condition Barang", "Proses Refund Tunai/Saldo"],
    inputs: ["Invoice ID", "Alasan Retur", "Metode Refund", "Nilai Refund"]
  },
  'stock-opname': {
    icon: BarChart,
    description: "Audit Stok Fisik: Menyelaraskan jumlah barang di sistem dengan kondisi nyata di gudang.",
    workflow: ["Hitung fisik barang", "Input ke sistem", "Auto-adjustment selisih (Stock Correction)"],
    inputs: ["Produk ID", "Stok Fisik", "Keterangan Selisih", "Tanggal Audit"]
  },
  'stock-transfers': {
    icon: Layers,
    description: "Mutasi Barang: Perpindahan stok antar gudang atau dari gudang ke etalase toko (POS).",
    workflow: ["Pilih Asal Lokasi", "Pilih Tujuan", "Approve pengiriman"],
    inputs: ["Dari Lokasi", "Ke Lokasi", "Item & Qty", "Ref Document"]
  },
  'orders': {
    icon: FileText,
    description: "Order Ledger: Daftar seluruh pesanan baik yang sudah lunas maupun yang sedang digarap (Draft).",
    workflow: ["Cek riwayat pesanan", "Cetak ulang struk/sj", "Update status pembayaran"],
    inputs: ["Search Keyword", "Status Filter", "Range Tanggal", "Customer ID"]
  },
  'shifts': {
    icon: Clock,
    description: "Manajemen Shift Kasir: Serah terima modal awal dan hitung setoran tunai per pergantian petugas.",
    workflow: ["Buka Shift (Input Modal)", "Tutup Shift (Input Uang Fisik)", "Lihat Selisih Kas"],
    inputs: ["Nama Kasir", "Modal Awal", "Total Tunai Diterima", "Catatan Selisih"]
  },
  'cash-flow': {
    icon: TrendingUp,
    description: "Arus Kas: Pencatatan operasional harian di luar transaksi (e.g. bayar listrik, beli galon).",
    workflow: ["Input Masuk/Keluar", "Pilih Akun Kas", "Set Kategori Biaya"],
    inputs: ["Nama Transaksi", "Jumlah (IDR)", "Tipe (Masuk/Keluar)", "Dokumen Pendukung"]
  },
  'vouchers': {
    icon: FileText,
    description: "Voucher & Promosi: Management kode diskon untuk event tertentu atau loyality customer.",
    workflow: ["Buat Kode Unik", "Set Minimal Belanja", "Set Masa Berlaku"],
    inputs: ["Nama Promo", "Kode Voucher", "Diskon (% or IDR)", "Limit Penggunaan"]
  },
  'payments': {
    icon: Settings,
    description: "Metode Pembayaran: Aktivasi channel bayaran (Tunai, QRIS, Transfer Bank, E-Wallet).",
    workflow: ["Input Nama Bank", "Setting Admin Fee", "Mapping ke Akun Akuntansi"],
    inputs: ["Provider Name", "Nomor Rekening", "Biaya Admin (%)", "Status Aktif"]
  },
  'users/manage': {
    icon: Users,
    description: "Master Pengguna: Pengaturan akun akses untuk Kasir, Operator Produksi, dan Admin.",
    workflow: ["Input Username/Email", "Assign ke Group User", "Set Password"],
    inputs: ["Nama Lengkap", "Email", "Password", "Assign Group ID"]
  },
  'groups': {
    icon: Users,
    description: "Grup Pengguna: Pengaturan role (e.g. Supervisor, Owner) untuk membatasi hak akses secara kolektif.",
    workflow: ["Input Nama Grup", "Mapping Hak Akses", "Assign User"],
    inputs: ["Nama Group", "Deskripsi Level", "Status Aktif"]
  },
  'menus': {
    icon: Settings,
    description: "Master Menu Sistem: Registrasi endpoint dan nama modul untuk pengaturan dinamis sidebar.",
    workflow: ["Input Nama Menu", "Set Router Path", "Set Icon Lucide"],
    inputs: ["Nama Menu", "URL Route", "Icon Tag", "Order Index"]
  },
  'group-menus': {
    icon: Layers,
    description: "Mapping Hak Akses: Penentuan menu mana saja yang boleh dilihat oleh grup user tertentu.",
    workflow: ["Pilih Grup", "Checklist Menu yang diijinkan", "Simpan Policy"],
    inputs: ["Group ID", "Menu ID List", "Permission Type (Read/Write/Delete)"]
  }
};

const PlaceholderPage = () => {
  const location = useLocation();
  const pathPart = location.pathname.split('/');
  const pathKey = pathPart.length > 2 ? `${pathPart[pathPart.length-2]}/${pathPart[pathPart.length-1]}` : (pathPart.pop() || '');
  const simpleKey = location.pathname.split('/').pop() || '';
  
  const info = moduleRegistry[pathKey] || moduleRegistry[simpleKey] || {
    icon: Info,
    description: "Modul ini sedang dalam tahap finalisasi arsitektur data untuk mendukung integrasi penuh.",
    workflow: ["Analisis Kebutuhan", "Implementasi Schema", "Finalisasi UI"],
    inputs: ["Sedang didefinisikan"]
  };

  const IconComp = info.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 bg-black text-white dark:bg-white dark:text-black p-10 flex flex-col items-center justify-center text-center rounded-2xl shadow-2xl">
          <IconComp size={64} strokeWidth={1} />
          <h2 className="text-3xl font-black italic tracking-tighter mt-6 uppercase">{pathKey.replace(/-/g, ' ')}</h2>
          <div className="mt-4 px-4 py-1.5 border border-white/20 dark:border-black/20 text-[10px] font-bold tracking-[0.3em] uppercase">Development Stage</div>
        </div>

        <div className="w-full md:w-2/3 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Deskripsi Modul</h3>
            <p className="text-lg font-medium leading-relaxed italic border-l-4 border-black dark:border-white pl-6">
              "{info.description}"
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Alur Kerja (Workflow)</h3>
              <ul className="space-y-3">
                {info.workflow.map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-full text-[9px]">{i+1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Input Data Utama</h3>
              <div className="flex flex-wrap gap-2">
                {info.inputs.map((input, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[9px] font-black uppercase tracking-tighter text-black dark:text-white">
                    {input}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex justify-between items-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Status: Ready for Code Implementation</div>
            <button className="px-6 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
               Request Implementation
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceholderPage;
