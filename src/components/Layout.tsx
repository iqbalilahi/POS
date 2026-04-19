import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Printer, 
  Database, 
  Users, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  BarChart2,
  MousePointer2,
  Layers,
  Shield,
  List,
  Package,
  Monitor,
  ClipboardCheck,
  FileText,
  Clock,
  User
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Layout = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    master: false,
    queue: false,
    transactions: false,
    accounting: false,
    users: false,
  });
  const location = useLocation();

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuGroups = [
    {
      id: 'main',
      items: [
        { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { title: 'POS (Retail)', path: '/pos', icon: ShoppingCart },
        { title: 'Printing Order', path: '/printing-order', icon: Printer },
      ]
    },
    {
      id: 'master',
      title: 'Master Data',
      icon: Database,
      items: [
        { title: 'Queue Services', path: '/master/queue-services', icon: Layers },
        { title: 'Step Templates', path: '/master/step-templates', icon: List },
        { title: 'Document Numbering', path: '/master/doc-numbering', icon: undefined },
        { title: 'Products', path: '/master/products', icon: FileText },
        { title: 'Product Categories', path: '/master/categories', icon: FileText },
        { title: 'Units', path: '/master/units', icon: FileText },
        { title: 'Suppliers', path: '/master/suppliers', icon: FileText },
        { title: 'Customers', path: '/master/customers', icon: FileText },
      ]
    },
    {
      id: 'queue',
      title: 'Queue Management',
      icon: MousePointer2,
      items: [
        { title: 'Manage Queue', path: '/queue/manage', icon: FileText },
        { title: 'Queue Display', path: '/queue/display', icon: Monitor },
      ]
    },
    {
      id: 'transactions',
      items: [
        { title: 'Purchase Orders', path: '/transactions/purchase-orders', icon: FileText },
        { title: 'Refunds', path: '/transactions/refunds', icon: FileText },
        { title: 'Stock Opname', path: '/transactions/stock-opname', icon: ClipboardCheck },
        { title: 'Stock Transfers', path: '/transactions/stock-transfers', icon: Layers },
        { title: 'Orders', path: '/transactions/orders', icon: FileText },
        { title: 'Sales', path: '/transactions/sales', icon: FileText },
        { title: 'Production', path: '/transactions/production', icon: FileText },
      ]
    },
    {
      id: 'accounting',
      title: 'Accounting',
      icon: BarChart2,
      items: [
        { title: 'Cashier Shifts', path: '/accounting/shifts', icon: Clock },
        { title: 'Cash Flow', path: '/accounting/cash-flow', icon: FileText },
        { title: 'Vouchers', path: '/accounting/vouchers', icon: FileText },
        { title: 'Payment Methods', path: '/accounting/payments', icon: FileText },
        { title: 'Profit & Loss', path: '/accounting/profit-loss', icon: BarChart2 },
        { title: 'Inventory Value', path: '/accounting/inventory', icon: Package },
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Shield,
      items: [
        { title: 'Users', path: '/users/manage', icon: User },
        { title: 'Group Users', path: '/users/groups', icon: FileText },
        { title: 'Menus', path: '/users/menus', icon: FileText },
        { title: 'Group Menus', path: '/users/group-menus', icon: FileText },
      ]
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black text-black dark:text-gray-300 font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        className={cn(
          "bg-black border-r border-gray-800 flex flex-col transition-all duration-300 z-50 overflow-hidden",
          !isSidebarOpen && "border-none"
        )}
      >
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-white rounded-none flex items-center justify-center font-bold text-black border-2 border-white">I</div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tighter text-white">INKPOS</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {menuGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {group.title ? (
                <>
                  <button
                    onClick={() => toggleMenu(group.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-none text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200 text-sm",
                      (location.pathname.startsWith(`/${group.id}`) || openMenus[group.id]) && "text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {group.icon && <group.icon size={18} />}
                      {isSidebarOpen && <span>{group.title}</span>}
                    </div>
                    {isSidebarOpen && (
                      <ChevronDown size={14} className={cn("transition-transform duration-200", openMenus[group.id] && "rotate-180")} />
                    )}
                  </button>
                  <AnimatePresence>
                    {openMenus[group.id] && isSidebarOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-11 space-y-1"
                      >
                        {group.items.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={cn(
                              "flex items-center gap-2 py-2 text-xs transition-colors hover:text-white",
                              isActive(subItem.path) ? "text-white font-bold" : "text-gray-500"
                            )}
                          >
                            <subItem.icon size={14} />
                            <span>{subItem.title}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-200 group text-sm",
                      isActive(item.path) 
                        ? "bg-white text-black font-semibold" 
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    )}
                  >
                    <item.icon size={18} />
                    {isSidebarOpen && <span>{item.title}</span>}
                  </Link>
                ))
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 transition-colors text-sm">
            <LogOut size={18} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between px-6 bg-white dark:bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-none transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="font-semibold text-lg tracking-tight">
              {location.pathname.split('/').pop()?.replace('-', ' ').toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-none transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-none" />
          </div>
        </header>

        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
