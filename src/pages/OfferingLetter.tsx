import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const OfferingLetter = () => {
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const currentDate = "Bekasi, 19 April 2026";
  const docNumber = "002-IP/QUO/IV/2026";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-black p-4 border border-gray-100 dark:border-gray-900 sticky top-0 z-10 shadow-sm">
        <div>
          <h2 className="text-xl font-black italic tracking-tighter">OFFERING LETTER GENERATOR</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">InkPOS Commercial Proposal</p>
        </div>
        <button 
          onClick={() => handlePrint()}
          className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-black text-[10px] tracking-widest hover:opacity-80 transition-all uppercase flex items-center gap-2"
        >
          <Printer size={14} /> Print Proposal
        </button>
      </div>

      <div className="flex justify-center bg-gray-100 dark:bg-gray-950 p-8 min-h-screen overflow-auto">
        <div 
          ref={printRef} 
          className="w-[210mm] bg-white text-black p-[20mm] shadow-2xl relative font-serif leading-relaxed text-sm print:shadow-none print:m-0 print:w-full"
          id="proposal-document"
        >
          {/* Header LOGO Placeholder */}
          <div className="flex justify-center mb-12">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
               <span className="text-white font-black text-4xl italic tracking-tighter">I</span>
            </div>
          </div>

          {/* PAGE 1: Formal Letter */}
          <div className="mb-[40mm]">
            <div className="text-right mb-12">
              <p>{currentDate}</p>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-xl font-bold underline uppercase tracking-widest">SURAT PENAWARAN</h1>
              <p className="font-mono text-xs">{docNumber}</p>
            </div>

            <div className="mb-8 space-y-1">
              <p>Kepada Yth,</p>
              <p className="font-bold">Bapak/Ibu Pimpinan Utama</p>
              <p>Calon Mitra Strategis InkPOS</p>
              <p>Jl. Bisnis Modern No. 88</p>
              <p>Bekasi, Jawa Barat</p>
            </div>

            <div className="mb-8 font-bold italic">
              <p>Perihal : Pengembangan Sistem InkPOS (Point of Sale & Printing Management)</p>
            </div>

            <div className="space-y-4 mb-12">
              <p>Dengan hormat,</p>
              <p>
                Terimakasih atas ketertarikan Anda terhadap produk kami. Kami sangat menghargai kesempatan yang diberikan untuk mempresentasikan penawaran terkait pekerjaan <b>Pengembangan dan Implementasi Sistem InkPOS</b>. 
              </p>
              <p>
                InkPOS dirancang khusus untuk memenuhi kebutuhan bisnis percetakan dan retail modern yang membutuhkan integrasi stock, antrian produksi, dan laporan keuangan dalam satu dashboard yang intuitif. Detail teknis dan penawaran finansial kami sampaikan pada halaman-halaman berikutnya.
              </p>
              <p>
                Besar harapan kami agar penawaran ini dapat disetujui untuk meningkatkan efisiensi operasional bisnis Anda. Jika terdapat pertanyaan lebih lanjut, silakan menghubungi kami di nomor <b>0895 1722 7009</b>.
              </p>
              <p>
                Demikian surat penawaran ini kami sampaikan. Terimakasih atas perhatian dan kerjasamanya.
              </p>
            </div>

            <div className="mt-20">
              <p>Hormat kami,</p>
              <div className="h-24" />
              <p className="font-bold border-b border-black w-fit">Arman Septian</p>
              <p className="italic text-xs">Product Development Head - InkPOS</p>
            </div>
          </div>

          <div className="print:break-before-page pt-10" />

          {/* PAGE 2: Feature Matrix */}
          <div className="mb-20">
             <h2 className="text-lg font-bold border-b-2 border-black pb-2 mb-6 uppercase tracking-widest">PROFIL & FITUR SISTEM</h2>
             <p className="mb-6 text-xs italic text-gray-600">
               Detail berikut merangkum kapabilitas utama sistem InkPOS yang akan diimplementasikan sesuai kebutuhan workflow operasional Anda.
             </p>

             <div className="space-y-8">
                <section>
                  <h3 className="font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">A. MODUL CORE RETAIL & POS</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <div>
                          <p className="font-bold">Master Inventory</p>
                          <p className="text-[10px]">Manajemen SKU lengkap dengan tracking stok minimum (Alert stock kabis).</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <div>
                          <p className="font-bold">Multi-Category POS</p>
                          <p className="text-[10px]">Antarmuka kasir cepat dengan dukungan scanner dan pencarian instan.</p>
                        </div>
                     </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">B. MODUL PRINTING & PRODUKSI</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <div>
                          <p className="font-bold">Queue Management</p>
                          <p className="text-[10px]">Antrian otomatis berdasarkan prioritas pesanan cetak (Normal/Urgent).</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <div>
                          <p className="font-bold">Step Templates</p>
                          <p className="text-[10px]">Instruksi kerja per item pesanan memudahkan operator produksi.</p>
                        </div>
                     </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-bold bg-gray-100 p-2 mb-4 border-l-4 border-black">C. ACCOUNTING & REPORTING</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <div>
                          <p className="font-bold">Profit & Loss Dashboard</p>
                          <p className="text-[10px]">Laporan laba rugi real-time berdasarkan HPP (COGS) dan Penjualan.</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <div>
                          <p className="font-bold">Inventory Valuation</p>
                          <p className="text-[10px]">Nilai aset stok gudang terkini untuk keperluan audit keuangan.</p>
                        </div>
                     </div>
                  </div>
                </section>
             </div>
          </div>

          <div className="print:break-before-page pt-10" />

          {/* PAGE 4: COMMERCIAL TERMS */}
          <div>
            <h2 className="text-lg font-bold border-b-2 border-black pb-2 mb-6 uppercase tracking-widest">PERSYARATAN & SIMULASI BIAYA</h2>
            
            <div className="mb-10 space-y-2">
               <h3 className="font-bold underline uppercase">Terms & Condition :</h3>
               <ol className="list-decimal pl-5 space-y-1">
                 <li>Pembayaran biaya <b>Development 25%</b> di awal setelah detail pekerjaan disepakati.</li>
                 <li>Waktu <b>Development</b> adalah 45 - 60 hari kerja.</li>
                 <li>Waktu <b>UAT (User Acceptance Testing)</b> adalah 14 hari kerja.</li>
                 <li>Termasuk Maintenance & Bug Fix selama 3 bulan setelah Go-Live.</li>
               </ol>
            </div>

            <div className="border border-black overflow-hidden rounded-lg">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-orange-100">
                    <tr>
                      <th className="border-b border-black p-4 font-bold">TAHAP PEMBAYARAN</th>
                      <th className="border-b border-black p-4 font-bold">PROGRES</th>
                      <th className="border-b border-black p-4 font-bold">PERSENTASE</th>
                      <th className="border-b border-black p-4 font-bold text-right">JUMLAH (IDR)</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-black/10">
                    <tr>
                      <td className="p-4">Down Payment (DP)</td>
                      <td className="p-4">0%</td>
                      <td className="p-4">25%</td>
                      <td className="p-4 text-right font-bold">{formatCurrency(6250000)}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Tahap 2 (Implementasi)</td>
                      <td className="p-4">50%</td>
                      <td className="p-4">25%</td>
                      <td className="p-4 text-right font-bold">{formatCurrency(6250000)}</td>
                    </tr>
                    <tr>
                      <td className="p-4">Tahap 3 (Final & UAT)</td>
                      <td className="p-4">100%</td>
                      <td className="p-4">50%</td>
                      <td className="p-4 text-right font-bold">{formatCurrency(12500000)}</td>
                    </tr>
                 </tbody>
                 <tfoot className="bg-black text-white">
                    <tr className="font-black">
                      <td colSpan={3} className="p-4 text-right uppercase tracking-[0.2em]">Total Project Value</td>
                      <td className="p-4 text-right text-lg">{formatCurrency(25000000)}</td>
                    </tr>
                 </tfoot>
               </table>
            </div>

            <div className="mt-12 text-[10px] text-gray-400 italic">
               * Penawaran ini berlaku selama 30 hari sejak tanggal diterbitkan. Harga dapat berubah sewaktu-waktu sesuai dengan penambahan request spesifik di luar modul standar yang ditawarkan.
            </div>
          </div>

          {/* Footer Contact Info */}
          <div className="absolute bottom-[10mm] left-[20mm] right-[20mm] flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-100 pt-4 print:fixed print:bottom-10">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Phone size={10}/> 0895 1722 7009</span>
              <span className="flex items-center gap-1"><Mail size={10}/> support@inkpos.id</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={10}/> Centennial Tower, 29th Floor, Jakarta Selatan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferingLetter;
