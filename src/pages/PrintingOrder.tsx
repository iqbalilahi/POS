import React from 'react';

const PrintingOrder = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">PRINTING JOBS</h2>
          <p className="text-gray-500 text-sm">Monitor production queue and job statuses</p>
        </div>
      </div>
      <div className="p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 text-gray-400">
        Printing Job queue coming soon...
      </div>
    </div>
  );
};

export default PrintingOrder;
