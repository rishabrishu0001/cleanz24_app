import express from "express";
import { User, Order, Valet, Store, isMongoConnected, getFallbackDb } from "../db.js";

const router = express.Router();

// GET /api/admin/users - Search and list all registered customers
router.get("/users", async (req, res) => {
  const { search } = req.query;
  try {
    if (isMongoConnected) {
      let query = {};
      if (search && search.trim()) {
        const s = search.trim();
        const cleanPhone = s.replace(/\D/g, "");
        query = {
          $or: [
            { name: { $regex: s, $options: "i" } },
            { email: { $regex: s, $options: "i" } },
            ...(cleanPhone ? [{ phone: { $regex: cleanPhone } }] : [{ phone: { $regex: s, $options: "i" } }])
          ]
        };
      }
      const users = await User.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, users, total: users.length });
    }

    const db = getFallbackDb();
    let users = db.users || [];
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      const cleanPhone = s.replace(/\D/g, "");
      users = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(s)) ||
        (u.email && u.email.toLowerCase().includes(s)) ||
        (u.phone && cleanPhone && u.phone.replace(/\D/g, "").includes(cleanPhone))
      );
    }
    return res.json({ success: true, users: [...users].reverse(), total: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  const { studioId } = req.query;

  try {
    let orders = [];
    let valetsCount = 0;
    let storesCount = 0;

    if (isMongoConnected) {
      const query = {};
      if (studioId && studioId !== "all") query.studioId = Number(studioId);
      orders = await Order.find(query);
      valetsCount = await Valet.countDocuments();
      storesCount = await Store.countDocuments();
    } else {
      const db = getFallbackDb();
      orders = db.orders;
      if (studioId && studioId !== "all") orders = orders.filter(o => String(o.studioId) === String(studioId));
      valetsCount = db.valets.length;
      storesCount = db.stores.length;
    }

    const todayRevenue = orders
      .filter(o => o.paymentStatus && o.paymentStatus.includes("Paid"))
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const activeQueue = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
    const deliveredCount = orders.filter(o => o.status === "Delivered").length;

    res.json({
      todayRevenue,
      activeQueue,
      deliveredCount,
      totalOrders: orders.length,
      valetsCount,
      storesCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders
router.get("/orders", async (req, res) => {
  const { studioId } = req.query;
  try {
    if (isMongoConnected) {
      const query = {};
      if (studioId && studioId !== "all") query.studioId = Number(studioId);
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ orders });
    }

    const db = getFallbackDb();
    let orders = db.orders;
    if (studioId && studioId !== "all") orders = orders.filter(o => String(o.studioId) === String(studioId));
    res.json({ orders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/valets
router.get("/valets", async (req, res) => {
  try {
    if (isMongoConnected) {
      const valets = await Valet.find();
      return res.json({ valets });
    }
    res.json({ valets: getFallbackDb().valets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;