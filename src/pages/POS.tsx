import React, { useState, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Wallet, 
  ShoppingCart,
  Package
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AsyncSelectInput } from '@/components/AsyncSelectInput';
import { useAsyncSelect } from '@/components/useAsyncSelect';
import { Receipt } from '@/components/Receipt';
import { formatCurrency } from '@/lib/utils';
import { Product, SaleItem } from '@/types';

// Extended local cart item to include UI details
interface CartItem extends Partial<SaleItem> {
  product_name: string;
  sku: string;
  qty: number;
  unit_price: number;
  subtotal: number;
  product_type: 'sell' | 'service';
}

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const { control, setValue, getValues, watch } = useForm({
    defaultValues: {
      customer_id: 1,
      payment_method: 'cash',
      search_product: '',
    }
  });

  const customerId = watch('customer_id');

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const { data } = await axios.get('/api/products', { params: { search: searchQuery } });
        setProducts(data.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  // Setup AsyncSelect for Customers
  const customerSelect = useAsyncSelect({
    fieldName: 'customer_id',
    setValue,
    getValues,
    fetchData: async (params) => {
      const { data } = await axios.get('/api/customers', { params });
      return data;
    },
    mapToOption: (item) => ({ id: item.id, value: item.id, label: item.name }),
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        const newQty = (existing.qty || 0) + 1;
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, qty: newQty, subtotal: newQty * (item.unit_price || 0) }
            : item
        );
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        qty: 1,
        unit_price: product.sell_price,
        discount: 0,
        subtotal: product.sell_price,
        product_type: product.product_type
      }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQty = Math.max(1, (item.qty || 0) + delta);
        return { ...item, qty: newQty, subtotal: newQty * (item.unit_price || 0) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.subtotal || 0), 0), [cart]);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCheckout = async (type: 'cash' | 'credit') => {
    if (cart.length === 0) return;
    
    // Simulate API Call to create tr_sales or tr_orders
    console.log("Creating transaction...", {
      type,
      customerId,
      items: cart,
      total
    });

    handlePrint();
    alert(`Success! Transaction recorded as ${type.toUpperCase()}`);
    setCart([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white dark:bg-black p-4 border border-gray-100 dark:border-gray-900 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search product (Name/SKU/Barcode)..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all text-[10px] font-bold uppercase tracking-widest outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
          {loadingProducts ? (
            <div className="col-span-full flex items-center justify-center p-20 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading catalog...</div>
          ) : products.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group flex flex-col bg-white dark:bg-black border border-gray-100 dark:border-gray-900 text-left hover:border-black dark:hover:border-white transition-all overflow-hidden"
            >
              <div className="h-24 bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-300 group-hover:bg-gray-100 dark:group-hover:bg-gray-900 transition-colors">
                <Package size={24} />
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${product.product_type === 'service' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                      {product.product_type}
                    </span>
                    <span className="text-[8px] text-gray-400 font-mono font-bold tracking-tighter">{product.sku}</span>
                  </div>
                  <h3 className="font-bold text-[11px] leading-tight uppercase group-hover:underline truncate">{product.name}</h3>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black">{formatCurrency(product.sell_price)}</span>
                </div>
              </div>
            </button>
          ))}
          
          <button 
            onClick={() => {
              const name = prompt("Item Name?");
              const price = prompt("Price?");
              if (name && price) {
                const manualId = Date.now();
                addToCart({
                  id: manualId,
                  name,
                  sell_price: parseInt(price),
                  product_type: confirm("Is this Printing?") ? 'service' : 'sell',
                  sku: 'MNL',
                  track_stock: false,
                  min_stock: 0,
                  buy_price: 0,
                  company_id: 1,
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });
              }
            }}
            className="flex flex-col items-center justify-center h-full min-h-[140px] bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-800 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all gap-2 group"
          >
            <Plus size={20} className="text-gray-400 group-hover:text-black dark:group-hover:text-white" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Right: Cart & Summary */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 flex-1 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-900">
            <AsyncSelectInput 
              name="customer_id"
              control={control as any}
              label="Customer Search"
              options={customerSelect.options}
              onMenuScrollToBottom={customerSelect.loadMore}
              placeholder="Search..."
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3 grayscale opacity-30">
                <ShoppingCart size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Empty Terminal</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product_id} className="group relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-[11px] font-black mb-0.5 uppercase tracking-tight">{item.product_name}</h4>
                      <div className="flex gap-2 items-center">
                         <span className={`text-[8px] font-bold px-1 ${item.product_type === 'service' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                           {item.product_type === 'service' ? 'PRINT' : 'RETAIL'}
                         </span>
                         <p className="text-[10px] text-gray-500 font-mono font-bold">
                           {formatCurrency(item.unit_price || 0)} x {item.qty}
                         </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product_id!)}
                      className="p-1 text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.product_id!, -1)}
                        className="w-6 h-6 border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-[11px] font-black w-6 text-center tabular-nums">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id!, 1)}
                        className="w-6 h-6 border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-[11px] font-black tabular-nums">{formatCurrency(item.subtotal || 0)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Tax (PPN 11%)</span>
              <span className="tabular-nums">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
              <span className="text-sm font-black uppercase italic tracking-tighter">Total Bill</span>
              <span className="text-xl font-black tabular-nums tracking-tighter">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            disabled={cart.length === 0}
            onClick={() => handleCheckout('credit')}
            className="py-4 bg-gray-100 dark:bg-gray-900 text-gray-500 font-black text-[10px] flex items-center justify-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Wallet size={16} /> Credit
          </button>
          <button 
            disabled={cart.length === 0}
            onClick={() => handleCheckout('cash')}
            className="py-4 bg-black text-white dark:bg-white dark:text-black font-black text-[10px] flex items-center justify-center gap-2 hover:opacity-80 transition-all uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-black/5 dark:shadow-white/5"
          >
            <CreditCard size={16} /> Pay Bill
          </button>
        </div>
      </div>

      <div className="hidden">
        <Receipt 
          ref={printRef}
          items={cart.map(item => ({
             ...item,
             id: item.id || 0,
             sale_id: 0, // Not yet created
             product_id: item.product_id || 0,
             product_name: item.product_name,
             qty: item.qty,
             unit_price: item.unit_price,
             discount: item.discount || 0,
             subtotal: item.subtotal
          }))}
          subtotal={subtotal}
          tax={tax}
          total={total}
          customerName={customerSelect.options.find(o => o.value === customerId)?.label || 'Walk-in Customer'}
          orderId={`POS-${Date.now().toString().slice(-6)}`}
        />
      </div>
    </div>
  );
};

export default POS;
