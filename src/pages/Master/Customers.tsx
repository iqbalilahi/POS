import React, { useRef } from 'react';
import axios from 'axios';
import { Customer, Params } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { User, Mail, Phone, ExternalLink } from 'lucide-react';
import { MTable } from '@/components/MTable';

const Customers = () => {
  const tableRef = useRef<any>(null);

  const fetchCustomers = async (params: Params) => {
    const { data } = await axios.get('/api/customers', { params });
    return data;
  };

  const columns = [
    {
      field: 'name',
      header: 'Client Info',
      sortable: true,
      filterable: true,
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400">
            <User size={18} />
          </div>
          <div>
            <div className="font-black text-[11px] tracking-tight uppercase">{customer.name}</div>
            <div className="font-mono text-[9px] text-gray-400 font-bold">{customer.customer_code}</div>
          </div>
        </div>
      )
    },
    {
      field: 'contact',
      header: 'Contact Details',
      render: (customer: Customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
            <Phone size={10} />
            {customer.phone || '-'}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
            <Mail size={10} />
            {customer.email || '-'}
          </div>
        </div>
      )
    },
    {
      field: 'customer_type',
      header: 'Tier',
      sortable: true,
      filterable: true,
      render: (customer: Customer) => (
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-950 text-[9px] font-black uppercase tracking-widest border border-gray-200 dark:border-gray-800">
          {customer.customer_type}
        </span>
      )
    },
    {
      field: 'total_spent',
      header: 'History',
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</div>
          <div className="font-black text-[11px]">{formatCurrency(customer.total_spent)}</div>
        </div>
      )
    },
    {
      field: 'points',
      header: 'Loyalty',
      sortable: true,
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
           <div className="w-full bg-gray-100 dark:bg-gray-900 h-1.5 rounded-full overflow-hidden w-16">
              <div 
                className="bg-black dark:bg-white h-full" 
                style={{ width: `${Math.min(100, (customer.points / 1000) * 100)}%` }} 
              />
           </div>
           <span className="text-[10px] font-black">{customer.points} PTS</span>
        </div>
      )
    },
    {
      field: 'actions',
      header: 'Profile',
      render: (customer: Customer) => (
        <button 
          className="p-2 border border-gray-100 dark:border-gray-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          title="View Profile"
        >
          <ExternalLink size={12} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <MTable
        ref={tableRef}
        title="Customer CRM Database"
        columns={columns}
        getData={fetchCustomers}
        enableButton={true}
        buttonText="New Client"
        onAddData={() => alert("Redirect to Add Customer Form")}
        placeholderSearch="Search Name / Phone..."
        showIndex={true}
      />
    </div>
  );
};

export default Customers;
