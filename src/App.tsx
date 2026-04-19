import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeContext';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import POS from '@/pages/POS';
import PrintingOrder from '@/pages/PrintingOrder';
import Products from '@/pages/Master/Products';
import Customers from '@/pages/Master/Customers';
import ProfitLoss from '@/pages/Accounting/ProfitLoss';
import InventoryValuation from '@/pages/Accounting/InventoryValuation';
import PlaceholderPage from '@/pages/PlaceholderPage';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="printing-order" element={<PrintingOrder />} />
            
            <Route path="master">
              <Route path="products" element={<Products />} />
              <Route path="customers" element={<Customers />} />
              <Route path="queue-services" element={<PlaceholderPage />} />
              <Route path="step-templates" element={<PlaceholderPage />} />
              <Route path="doc-numbering" element={<PlaceholderPage />} />
              <Route path="categories" element={<PlaceholderPage />} />
              <Route path="units" element={<PlaceholderPage />} />
              <Route path="suppliers" element={<PlaceholderPage />} />
            </Route>

            <Route path="queue">
              <Route path="manage" element={<PlaceholderPage />} />
              <Route path="display" element={<PlaceholderPage />} />
            </Route>

            <Route path="transactions">
              <Route path="purchase-orders" element={<PlaceholderPage />} />
              <Route path="refunds" element={<PlaceholderPage />} />
              <Route path="stock-opname" element={<PlaceholderPage />} />
              <Route path="stock-transfers" element={<PlaceholderPage />} />
              <Route path="orders" element={<PlaceholderPage />} />
              <Route path="sales" element={<PlaceholderPage />} />
              <Route path="production" element={<PlaceholderPage />} />
            </Route>

            <Route path="accounting">
              <Route path="profit-loss" element={<ProfitLoss />} />
              <Route path="inventory" element={<InventoryValuation />} />
              <Route path="sales-report" element={<Dashboard />} />
              <Route path="shifts" element={<PlaceholderPage />} />
              <Route path="cash-flow" element={<PlaceholderPage />} />
              <Route path="vouchers" element={<PlaceholderPage />} />
              <Route path="payments" element={<PlaceholderPage />} />
            </Route>

            <Route path="users">
              <Route path="manage" element={<PlaceholderPage />} />
              <Route path="groups" element={<PlaceholderPage />} />
              <Route path="menus" element={<PlaceholderPage />} />
              <Route path="group-menus" element={<PlaceholderPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
