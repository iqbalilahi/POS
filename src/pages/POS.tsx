import React, { useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Wallet, 
  ShoppingCart,
  FileText,
  Printer
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AsyncSelectInput } from '@/components/AsyncSelectInput';
import { useAsyncSelect } from '@/components/useAsyncSelect';
import { Receipt } from '@/components/Receipt';
import { cn, formatCurrency } from '@/lib/utils';
import { Product, OrderItem, Customer } from '@/types';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Print A4 Black', sku: 'PR001', category_id: '1', type: 'printing', unit_id: 'lbr', base_price: 200, sell_price: 500, stock: 9999 },
  { id: '2', name: 'Print A4 Color', sku: 'PR002', category_id: '1', type: 'printing', unit_id: 'lbr', base_price: 500, sell_price: 1500, stock: 9999 },
  { id: '3', name: 'Kertas HVS 1 Rim', sku: 'RT001', category_id: '2', type: 'retail', unit_id: 'rim', base_price: 45000, sell_price: 55000, stock: 50 },
  { id: '4', name: 'Pulpen Joyko', sku: 'RT002', category_id: '2', type: 'retail', unit_id: 'pcs', base_price: 1500, sell_price: 3000, stock: 120 },
];

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Walk-in Customer', phone: '-', debt_limit: 0 },
  { id: '2', name: 'Digital Print Shop', phone: '08123456789', debt_limit: 5000000 },
];

const POS = () => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: {
      customer_id: '1',
      payment_method: 'cash',
      search_product: '',
    }
  });

  const customerId = watch('customer_id');

  const selectedCustomer = useMemo(() => 
    MOCK_CUSTOMERS.find(c => c.id === customerId),
  [customerId]);

  // Setup AsyncSelect for Customers
  const customerSelect = useAsyncSelect({
    fieldName: 'customer_id',
    setValue,
    getValues,
    fetchData: async () => ({ data: MOCK_CUSTOMERS, total: MOCK_CUSTOMERS.length }),
    mapToOption: (item) => ({ id: item.id, value: item.id, label: item.name }),
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        price: product.sell_price,
        discount: 0,
        total: product.sell_price,
        is_printing: product.type === 'printing'
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white dark:bg-gray-950 p-4 border border-gray-100 dark:border-gray-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search product (Name/Barcode)..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_PRODUCTS.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group p-4 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-left hover:border-black dark:hover:border-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    product.type === 'printing' ? "bg-black text-white" : "bg-gray-200 text-black"
                  )}>
                    {product.type}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{product.sku}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:underline">{product.name}</h3>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <span className="text-xs text-gray-500">{product.stock} {product.unit_id}</span>
                <span className="font-bold text-lg">{formatCurrency(product.sell_price)}</span>
              </div>
            </button>
          ))}
          
          {/* Manual Entry Placeholder */}
          <button 
            onClick={() => {
              const name = prompt("Item Name?");
              const price = prompt("Price?");
              const type = confirm("Is this Printing?") ? 'printing' : 'retail';
              if (name && price) {
                addToCart({
                  id: 'manual-' + Date.now(),
                  name,
                  sell_price: parseInt(price),
                  type: type as any,
                  sku: 'MNL',
                  category_id: '0',
                  unit_id: 'pcs',
                  base_price: 0,
                  stock: 999
                });
              }
            }}
            className="p-4 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <Plus size={24} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
            <span className="text-xs font-medium text-gray-500">Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Right: Cart & Summary */}
      <div className="w-[400px] flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-900">
            <AsyncSelectInput 
              name="customer_id"
              control={control}
              label="Customer"
              options={customerSelect.options}
              onMenuScrollToBottom={customerSelect.loadMore}
              placeholder="Select customer..."
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 grayscale opacity-50">
                <ShoppingCart size={48} />
                <p className="text-sm font-medium italic">Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="group relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold mb-0.5">{item.product_name}</h4>
                      <p className="text-xs text-gray-500 font-mono">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(item.total)}</span>
                  </div>
                  {item.is_printing && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-black border-l-2 border-black dark:border-white">
                       <button className="text-[10px] uppercase font-bold text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1">
                          <FileText size={10} /> Production Job Details
                       </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-black border-t border-gray-100 dark:border-gray-900 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tax (PPN 11%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
              <span>Total</span>
              <span className="text-black dark:text-white">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              if (cart.length === 0) return;
              handlePrint();
              alert("Payment Processing (Credit)");
              setCart([]);
            }}
            className="py-4 bg-gray-200 dark:bg-gray-900 text-black dark:text-gray-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-800 transition-all uppercase tracking-widest"
          >
            <Wallet size={18} /> Credit
          </button>
          <button 
            onClick={() => {
              if (cart.length === 0) return;
              handlePrint();
              alert("Payment Successful (Cash)");
              setCart([]);
            }}
            className="py-4 bg-black text-white dark:bg-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all uppercase tracking-widest"
          >
            <CreditCard size={18} /> Pay Now
          </button>
        </div>
      </div>

      {/* Hidden Receipt Component */}
      <div className="hidden">
        <Receipt 
          ref={printRef}
          items={cart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          customerName={selectedCustomer?.name}
          orderId={Math.floor(1000 + Math.random() * 9000).toString()}
        />
      </div>
    </div>
  );
};

export default POS;
