import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import ordersRoutes from "./routes/orders.js";
import storesRoutes from "./routes/stores.js";
import adminRoutes from "./routes/admin.js";
import walletRoutes from "./routes/wallet.js";
import { connectDB, isMongoConnected } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Cleanz24 Backend API",
    version: "1.0.3-whatsapp-live",
    database: isMongoConnected ? "MongoDB (Connected)" : "Hybrid Mode (Awaiting MongoDB Connection)",
    timestamp: new Date().toISOString()
  });
});

// Services Catalog
app.get("/api/services", (req, res) => {
  res.json({
    services: [
      { id: "wf_bag", name: "Standard Wash & Fold Bag", price: 49, unit: "/ kg", category: "Laundry", turnaround: "24 Hours" },
      { id: "dc_suit", name: "2-Piece Men / Women Suit", price: 399, unit: "/ suit", category: "Dry Cleaning", turnaround: "48 Hours" },
      { id: "dc_shirt", name: "Premium Shirt / Kurta", price: 99, unit: "/ piece", category: "Dry Cleaning", turnaround: "24 Hours" },
      { id: "sp_trousers", name: "Steam Press - Trousers / Jeans", price: 45, unit: "/ piece", category: "Steam Press", turnaround: "Same Day" },
      { id: "dc_saree", name: "Silk / Designer Saree Care", price: 299, unit: "/ saree", category: "Dry Cleaning", turnaround: "48 Hours" },
      { id: "dc_blanket", name: "Heavy Winter Blanket / Quilt", price: 449, unit: "/ item", category: "Home Care", turnaround: "48 Hours" },
      { id: "dc_shoes", name: "Sneakers & Leather Shoe Spa", price: 349, unit: "/ pair", category: "Shoe Spa", turnaround: "72 Hours" }
    ]
  });
});

// Route Handlers
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wallet", walletRoutes);

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Cleanz24 Backend Server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
});