import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Mock Database (Simulating PostgreSQL Tables) ---

const DB = {
  branches: [
    { id: 1, branch_code: 'BR01', branch_name: 'Main HQ', is_main_branch: true, created_at: new Date().toISOString(), is_active: true },
    { id: 2, branch_code: 'BR02', branch_name: 'Sub Branch A', is_main_branch: false, created_at: new Date().toISOString(), is_active: true },
  ],
  customers: [
    { id: 1, name: 'Walk-in Customer', customer_code: 'CUST-001', phone: '08123456789', customer_type: 'regular', points: 0, total_spent: 500000, created_at: new Date().toISOString(), is_active: true },
    { id: 2, name: 'Digital Print Shop', customer_code: 'CUST-002', phone: '08987654321', customer_type: 'wholesale', points: 450, total_spent: 12500000, created_at: new Date().toISOString(), is_active: true },
  ],
  products: [
    { id: 1, sku: 'INK-BK-01', name: 'Black Ink Canon', product_type: 'sell', buy_price: 35000, sell_price: 45000, track_stock: true, min_stock: 5, stock: 154, created_at: new Date().toISOString(), is_active: true },
    { id: 2, sku: 'PAP-A4-70', name: 'Paper A4 70gsm', product_type: 'sell', buy_price: 45000, sell_price: 55000, track_stock: true, min_stock: 10, stock: 85, created_at: new Date().toISOString(), is_active: true },
    { id: 3, sku: 'SRV-PRT-A4', name: 'Print A4 Black/White', product_type: 'service', buy_price: 200, sell_price: 1500, track_stock: false, min_stock: 0, stock: 0, created_at: new Date().toISOString(), is_active: true },
  ],
  sales: [
    { id: 1, sale_number: 'SAL-0001', customer_name: 'Walk-in Customer', grand_total: 150000, cogs_total: 45000, status: 'completed', payment_method: 'cash', created_at: '2026-04-18T10:00:00Z', is_active: true },
    { id: 2, sale_number: 'SAL-0002', customer_name: 'Digital Print Shop', grand_total: 2500000, cogs_total: 1200000, status: 'completed', payment_method: 'credit', created_at: '2026-04-19T11:30:00Z', is_active: true },
  ],
  production_jobs: [
    { id: 1, job_number: 'JOB-0001', order_id: 1, operator_name: 'Budi', status: 'processing', priority: 1, created_at: new Date().toISOString(), is_active: true },
    { id: 2, job_number: 'JOB-0002', order_id: 2, operator_name: '-', status: 'pending', priority: 0, created_at: new Date().toISOString(), is_active: true },
    { id: 3, job_number: 'JOB-0003', order_id: 3, operator_name: 'Siti', status: 'qc', priority: 2, created_at: new Date().toISOString(), is_active: true },
  ],
  orders: [],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", message: "InkPOS API is healthy", timestamp: new Date().toISOString() });
  });

  // Customers API
  app.get("/api/customers", (req: Request, res: Response) => {
    const { search, page = 1, per_page = 10 } = req.query;
    let filtered = [...DB.customers];
    
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.customer_code.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      );
    }

    const start = (Number(page) - 1) * Number(per_page);
    const end = start + Number(per_page);
    const total = filtered.length;
    
    res.json({
      data: filtered.slice(start, end),
      total,
      current_page: Number(page),
      per_page: Number(per_page),
      total_pages: Math.ceil(total / Number(per_page)),
      from: start + 1,
      to: Math.min(end, total)
    });
  });

  // Products API
  app.get("/api/products", (req: Request, res: Response) => {
    const { search, type, page = 1, per_page = 10 } = req.query;
    let filtered = [...DB.products];

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q)
      );
    }

    if (type) {
      filtered = filtered.filter(p => p.product_type === type);
    }

    const start = (Number(page) - 1) * Number(per_page);
    const end = start + Number(per_page);
    const total = filtered.length;

    res.json({
      data: filtered.slice(start, end),
      total,
      current_page: Number(page),
      per_page: Number(per_page),
      total_pages: Math.ceil(total / Number(per_page)),
      from: start + 1,
      to: Math.min(end, total)
    });
  });

  // Placeholder for missing routes from Sidebar
  app.get("/api/:table", (req: Request, res: Response) => {
    const table = req.params.table as string;
    const tableData = (DB as any)[table];
    if (tableData) {
      res.json({ data: tableData, total: tableData.length });
    } else {
      res.json({ data: [], total: 0, message: "Table logic not yet implemented in mock DB" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InkPOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
