import React, { forwardRef } from 'react';
import { OrderItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReceiptProps {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  orderId: string;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({
  items,
  subtotal,
  tax,
  total,
  customerName = "General Customer",
  orderId
}, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-black w-[80mm] mx-auto text-[12px] font-mono leading-tight">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold tracking-tighter">INKPOS PRINTING</h1>
        <p className="text-[10px] mt-1">Jl. Percetakan Modern No. 42</p>
        <p className="text-[10px]">Telp: 021-555-1234</p>
      </div>

      <div className="border-t border-b border-black border-dashed py-2 mb-4 space-y-1">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatDate(new Date())}</span>
        </div>
        <div className="flex justify-between">
          <span>Order:</span>
          <span>#{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span className="truncate max-w-[40%]">{customerName}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between font-bold">
              <span>{item.product_name}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>{item.qty} x {formatCurrency(item.unit_price)}</span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
            {item.notes && <p className="text-[10px] italic">- {item.notes}</p>}
          </div>
        ))}
      </div>

      <div className="border-t border-black border-dashed pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (11%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>TOTAL:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-8 text-center text-[10px]">
        <p>Thank you for your business!</p>
        <p className="mt-2 font-bold uppercase tracking-wider">No Refund After Printing</p>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';
