import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "InkPOS API is healthy" });
  });

  // Example API for AsyncSelect
  app.get("/api/customers", (req, res) => {
    const { search, page = 1, per_page = 10 } = req.query;
    // In a real app, query DB
    res.json({
      data: [
        { id: '1', name: 'Walk-in Customer' },
        { id: '2', name: 'Digital Print Shop' }
      ],
      total: 2,
    });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InkPOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
