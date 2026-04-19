import React from 'react';

const Products = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">PRODUCT MASTER</h2>
          <p className="text-gray-500 text-sm">Manage your inventory and pricing models</p>
        </div>
        <button className="bg-black text-white px-6 py-3 font-bold text-sm tracking-widest hover:opacity-90 transition-all uppercase">
          Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-900 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest ">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest ">SKU</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest ">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest ">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest ">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {[1, 2, 3].map(i => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors">
                <td className="px-6 py-4 font-semibold text-sm">Product Sample {i}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">SKU-00{i}</td>
                <td className="px-6 py-4 text-sm">120 pcs</td>
                <td className="px-6 py-4 font-bold text-sm">Rp {15000 * i}</td>
                <td className="px-6 py-4">
                  <button className="text-xs font-bold hover:underline">EDIT</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
