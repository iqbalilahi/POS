import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Mail, Phone, MapPin, CheckCircle2, CheckSquare, Square, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const OfferingLetter = () => {
  const printRef = useRef<HTMLDivElement>(null);
  
  // State for feature toggles
  // const [includePrinting, setIncludePrinting] = useState(false);
  // const [includeAI, setIncludeAI] = useState(false);

  // Pricing Logic
  const basePrice = 15000000;
  const printingAddonPrice = 5000000;
  const aiAddonPrice = 5000000;

  const totalPrice = basePrice;
  // const totalPrice = basePrice + (includePrinting ? printingAddonPrice : 0) + (includeAI ? aiAddonPrice : 0);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const currentDate = "Bekasi, 19 April 2026";
  const docNumber = "002-IP/QUO/IV/2026";

  return (
    <div className="space-y-6">
      {/* Interactive Controls (Hidden during print) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-black p-4 border border-gray-100 dark:border-gray-900 sticky top-0 z-10 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-black italic tracking-tighter">OFFERING LETTER GENERATOR</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">InkPOS Commercial Proposal</p>
        </div>
        
        {/* <div className="flex flex-wrap items-center gap-4 border-l-0 lg:border-l border-gray-100 dark:border-gray-800 lg:pl-6">
           <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest w-full lg:w-auto">Package Config:</p>
           <button 
             onClick={() => setIncludePrinting(!includePrinting)}
             className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all text-[10px] font-bold uppercase tracking-tighter ${includePrinting ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'text-gray-400 border-gray-100'}`}
           >
             {includePrinting ? <CheckSquare size={14} /> : <Square size={14} />}
             Printing Engine
           </button>
           <button 
             onClick={() => setIncludeAI(!includeAI)}
             className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all text-[10px] font-bold uppercase tracking-tighter ${includeAI ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'text-gray-400 border-gray-100'}`}
           >
             {includeAI ? <CheckSquare size={14} /> : <Square size={14} />}
             AI Assistance
           </button>
        </div> */}

        <div className="flex items-center gap-4 ml-auto">
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Price</p>
            <p className="font-black text-lg tabular-nums">{formatCurrency(totalPrice)}</p>
          </div>
          <button 
            onClick={() => handlePrint()}
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-black text-[10px] tracking-widest hover:opacity-80 transition-all uppercase flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Printer size={14} /> Print Proposal
          </button>
        </div>
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
              <p>Bpk Giharto</p>
              <p>Grafika Aksara Semesta</p>
              <p>Jl. Alamanda Utara 14 No.33,</p>
              <p>Bekasi Kabupaten, 17510, ID</p>
            </div>

            <div className="mb-8 font-bold italic">
              <p>Perihal : Pengembangan Sistem InkPOS (Point of Sales)</p>
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
                Besar harapan kami agar penawaran ini dapat disetujui untuk meningkatkan efisiensi operasional bisnis Anda. Jika terdapat pertanyaan lebih lanjut, silakan menghubungi kami di nomor <b>0896 3524 4513</b>.
              </p>
              <p>
                Demikian surat penawaran ini kami sampaikan. Terimakasih atas perhatian dan kerjasamanya.
              </p>
            </div>

            <div className="mt-20">
              <p>Hormat kami,</p>
              <div className="h-24" />
              <p className="font-bold border-b border-black w-fit">Choirul Iqbal Nuril Ilahi</p>
              <p className="italic text-xs">Product Development Head - POS</p>
            </div>
          </div>

          <div className="print:break-before-page pt-10" />

          {/* PAGE 2: Technical Detailed Menu (Mirroring PDF) */}
          <div className="mb-20">
             <h2 className="text-lg font-bold border-b-2 border-black pb-2 mb-6 uppercase tracking-widest">DETAIL PENGEMBANGAN APLIKASI</h2>
             <p className="mb-6 text-xs italic text-gray-600">
               Detail daftar menu di bawah ini merupakan rincian fungsionalitas yang akan dikembangkan dalam sistem InkPOS.
             </p>

             <div className="border border-black overflow-hidden mb-8">
               <table className="w-full text-[10px] border-collapse">
                 <thead className="bg-orange-100 font-bold uppercase tracking-widest text-center">
                   <tr>
                     <th className="border border-black p-2 w-[5%] text-center">No</th>
                     <th className="border border-black p-2 w-[25%] text-left">Menu</th>
                     <th className="border border-black p-2 text-left">Detail Pengembangan Modul</th>
                   </tr>
                 </thead>
                 <tbody>
                   {/* SECTION A */}
                   <tr className="bg-gray-100 font-black">
                     <td className="border border-black p-2 text-center text-xs">A</td>
                     <td className="border border-black p-2 text-xs" colSpan={2}>WEB DEVELOPMENT (DASHBOARD & BACKEND)</td>
                   </tr>
                   <tr>
                     <td className="border border-black p-2 text-center align-top">A.1</td>
                     <td className="border border-black p-2 align-top font-bold">Modul Master Data & Warehouse</td>
                     <td className="border border-black p-2 space-y-2">
                       <div>
                         <p className="font-black bg-gray-50 border-double border-b border-black/10 w-fit">Master Data & Integrasi</p>
                         <p className="pl-2">- Master Produk (SKU, Harga Beli/Jual, Pajak)</p>
                         <p className="pl-2">- Master Supplier & CRM Customer</p>
                         <p className="pl-2">- Master Satuan (UoM) & Gudang</p>
                         <p className="pl-2">- Migrasi Data dari Excel / Sistem Lama</p>
                       </div>
                       {/* {includePrinting && (
                        <div>
                          <p className="font-black bg-gray-50 border-double border-b border-black/10 w-fit">Master Antrian Produksi</p>
                          <p className="pl-2">- Mapping Urutan Produksi (Step Templates)</p>
                          <p className="pl-2">- Layanan Antrian (Express/Standard)</p>
                        </div>
                       )} */}
                     </td>
                   </tr>
                   <tr>
                     <td className="border border-black p-2 text-center align-top">A.2</td>
                     <td className="border border-black p-2 align-top font-bold">Modul Transaksi & Keuangan</td>
                     <td className="border border-black p-2 space-y-2">
                        <div>
                         <p className="font-black bg-gray-50 border-double border-b border-black/10 w-fit">Point of Sale (POS) & Billing</p>
                         <p className="pl-2">- Kasir Retail & Printing Order Management</p>
                         <p className="pl-2">- Penyesuaian Harga & Voucher Diskon</p>
                         <p className="pl-2">- Pembayaran terintegrasi via Link Web (Invoice)</p>
                       </div>
                       <div>
                         <p className="font-black bg-gray-50 border-double border-b border-black/10 w-fit">Notifikasi & Reporting</p>
                         <p className="pl-2">- Notifikasi Nota via Email & WhatsApp (Optional)</p>
                         <p className="pl-2">- Laporan Laba Rugi (P&L) & Stock Opname</p>
                       </div>
                     </td>
                   </tr>

                   {/* SECTION B */}
                   {/* {includeAI && (
                     <>
                      <tr className="bg-gray-100 font-black">
                        <td className="border border-black p-2 text-center text-xs">B</td>
                        <td className="border border-black p-2 text-xs" colSpan={2}>ADVANCED AI ASSISTANCE</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 text-center align-top">B.1</td>
                        <td className="border border-black p-2 align-top font-bold">InkPOS Intelligent Engine</td>
                        <td className="border border-black p-2 space-y-2">
                           <div>
                            <p className="font-black bg-gray-50 border-double border-b border-black/10 w-fit">Chat Dengan AI (InkPOS Assistant)</p>
                            <p className="pl-2">- Monitoring Status Antrian via AI Agent</p>
                            <p className="pl-2">- Quick Help: Info Stok & Laporan Penjualan</p>
                            <p className="pl-2">- Integrasi n8n untuk Automasi Workflow</p>
                          </div>
                        </td>
                      </tr>
                     </>
                   )} */}
                   
                   {/* <tr className="bg-gray-100 font-black">
                      <td className="border border-black p-2 text-center text-xs">{includeAI ? 'C' : 'B'}</td>
                      <td className="border border-black p-2 text-xs" colSpan={2}>USER SECURITY & ACCESS</td>
                   </tr>
                   <tr>
                     <td className="border border-black p-2 text-center align-top">{includeAI ? 'C.1' : 'B.1'}</td>
                     <td className="border border-black p-2 align-top font-bold">Keamanan & Akses</td>
                     <td className="border border-black p-2">
                        <p className="pl-2">- Login System: Multi-Level User Rights</p>
                        <p className="pl-2">- Otentikasi: Login Google & 2FA Security</p>
                     </td>
                   </tr> */}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="print:break-before-page pt-10" />

          {/* PAGE 4: COMMERCIAL TERMS & MARKET ANALYSIS */}
          <div>
            <h2 className="text-lg font-bold border-b-2 border-black pb-2 mb-6 uppercase tracking-widest">PERSYARATAN & ANALISA BIAYA</h2>
            
            <div className="mb-8 p-4 bg-gray-50 border-l-4 border-orange-400">
               <h3 className="text-xs font-black uppercase mb-1">Market Analysis (Indonesia POS Standards):</h3>
               <p className="text-[9px] leading-relaxed italic text-gray-600">
                 Berdasarkan rata-rata industri IT di Indonesia, sistem POS Kustom dengan integrasi Inventory & Accounting biasanya dihargai antara <b>Rp 15jt - Rp 50jt</b>. Penawaran InkPOS ini mencakup harga kompetitif dengan fitur premium yang setara dengan sistem Enterprise.
               </p>
            </div>

            <div className="mb-10 space-y-2">
               <h3 className="font-bold underline uppercase">Terms & Condition :</h3>
               <ol className="list-decimal pl-5 space-y-1">
                 <li>Pembayaran biaya <b>Development 25%</b> di awal setelah detail pekerjaan disepakati.</li>
                 <li>Waktu <b>Development</b> adalah {totalPrice > 20000000 ? '45 - 60' : '30 - 45'} hari kerja.</li>
                 <li>Waktu <b>UAT (User Acceptance Testing)</b> adalah 14 hari kerja.</li>
                 <li>Termasuk Maintenance & Bug Fix selama 3 bulan setelah Go-Live.</li>
               </ol>
            </div>

            <div className="border border-black overflow-hidden rounded-lg">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-orange-100">
                    <tr>
                      <th className="border-b border-black p-4 font-bold text-xs">TAHAP PEMBAYARAN</th>
                      <th className="border-b border-black p-4 font-bold text-xs">PROGRES</th>
                      <th className="border-b border-black p-4 font-bold text-xs">PERSENTASE</th>
                      <th className="border-b border-black p-4 font-bold text-right text-xs">JUMLAH (IDR)</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-black/10">
                    <tr>
                      <td className="p-4 text-xs font-bold">Down Payment (DP)</td>
                      <td className="p-4 text-xs">0%</td>
                      <td className="p-4 text-xs">25%</td>
                      <td className="p-4 text-right font-bold text-xs">{formatCurrency(totalPrice * 0.25)}</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-xs font-bold">Tahap 2 (Implementasi)</td>
                      <td className="p-4 text-xs">50%</td>
                      <td className="p-4 text-xs">25%</td>
                      <td className="p-4 text-right font-bold text-xs">{formatCurrency(totalPrice * 0.25)}</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-xs font-bold">Tahap 3 (Final & UAT)</td>
                      <td className="p-4 text-xs">100%</td>
                      <td className="p-4 text-xs">50%</td>
                      <td className="p-4 text-right font-bold text-xs">{formatCurrency(totalPrice * 0.5)}</td>
                    </tr>
                 </tbody>
                 <tfoot className="bg-black text-white">
                    <tr className="font-black">
                      <td colSpan={3} className="p-4 text-right uppercase tracking-[0.2em] text-xs">Total Project Value</td>
                      <td className="p-4 text-right text-sm">{formatCurrency(totalPrice)}</td>
                    </tr>
                 </tfoot>
               </table>
            </div>

            <div className="mt-12 p-4 bg-gray-50 border border-gray-200 text-[10px] text-gray-500 italic space-y-2">
               {/* <div className="flex gap-2 items-start"><Info size={12} className="shrink-0 mt-0.5" /> <p>Penawaran ini mencakup modul terpilih: {includePrinting && 'Printing Engine, '}{includeAI && 'AI Assistant Assistance, '}serta Core POS & Inventory.</p></div> */}
               <p>* Penawaran ini berlaku selama 30 hari sejak tanggal diterbitkan. Harga dapat berubah sewaktu-waktu sesuai dengan penambahan request spesifik di luar modul standar yang ditawarkan.</p>
            </div>
          </div>

          {/* Footer Contact Info */}
          <div className="absolute bottom-[10mm] left-[20mm] right-[20mm] flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-100 pt-4 print:fixed print:bottom-10">
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Phone size={10}/> 089635244513</span>
              <span className="flex items-center gap-1"><Mail size={10}/> iqbalilahi7@gmail.com</span>
            </div>
            {/* <div className="flex items-center gap-1">
              <MapPin size={10}/> Centennial Tower, 29th Floor, Jakarta Selatan
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferingLetter;
