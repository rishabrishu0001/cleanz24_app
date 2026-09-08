import express from "express";
import { Order, User, WalletTransaction, isMongoConnected, getFallbackDb, saveFallbackDb } from "../db.js";

const router = express.Router();

// GET /api/orders
router.get("/", async (req, res) => {
  const { userId, studioId } = req.query;
  try {
    if (isMongoConnected) {
      const query = {};
      if (userId) query.customerId = userId;
      if (studioId && studioId !== "all") query.studioId = Number(studioId);
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json({ orders });
    }

    const db = getFallbackDb();
    let orders = db.orders;
    if (userId) orders = orders.filter(o => o.customerId === userId);
    if (studioId && studioId !== "all") orders = orders.filter(o => String(o.studioId) === String(studioId));
    res.json({ orders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/active
router.get("/active", async (req, res) => {
  const userId = req.query.userId || "usr_rishab";
  try {
    if (isMongoConnected) {
      const active = await Order.findOne({
        customerId: userId,
        status: { $nin: ["Delivered", "Cancelled"] }
      }).sort({ createdAt: -1 });
      return res.json({ order: active || null });
    }

    const db = getFallbackDb();
    const activeOrder = db.orders.find(
      o => o.customerId === userId && o.status !== "Delivered" && o.status !== "Cancelled"
    ) || db.orders[0];
    res.json({ order: activeOrder || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    if (isMongoConnected) {
      const order = await Order.findOne({ id: req.params.id });
      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.json({ order });
    }
    const db = getFallbackDb();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  const {
    userId, customerName, customerPhone, items, pickupDate,
    pickupSlot, address, totalPrice, paymentMethod, studioId, studioName
  } = req.body;

  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const newOrderData = {
    id: `CZ-${orderNumber}`,
    customerId: userId || "usr_rishab",
    customerName: customerName || "Rishab Singh",
    customerPhone: customerPhone || "+91 9310590680",
    statusStep: 1,
    status: "Pickup Scheduled",
    progress: 10,
    deliveryTime: "Tomorrow by 06:00 PM",
    pickupDate: pickupDate || "Today",
    pickupSlot: pickupSlot || "11:30 AM",
    address: address || "Sector 94, Noida",
    studioId: studioId || 1,
    studioName: studioName || "Cleanz24 - Sector 41 Noida",
    driver: {
      id: "valet_1",
      name: "David Santos",
      phone: "+91 91380 04800",
      rating: "4.9 ⭐",
      vehicle: "Cleanz EV Van #14"
    },
    items: items || [{ id: "wf_bag", name: "Standard Wash & Fold Bag", price: 49, quantity: 5, unit: "/ kg" }],
    totalPrice: totalPrice || 245,
    paymentMethod: paymentMethod || "UPI / COD",
    paymentStatus: paymentMethod === "wallet" ? "Paid (Wallet)" : "Pending"
  };

  try {
    if (isMongoConnected) {
      const order = await Order.create(newOrderData);
      if (paymentMethod === "wallet" && userId) {
        await User.findOneAndUpdate(
          { id: userId, walletBalance: { $gte: totalPrice } },
          { $inc: { walletBalance: -totalPrice } }
        );
        await WalletTransaction.create({
          id: "tx_" + Date.now(),
          userId,
          type: "debit",
          amount: totalPrice,
          description: `Order #${order.id} Payment`
        });
      }
      return res.status(201).json({ success: true, order });
    }

    const db = getFallbackDb();
    db.orders.unshift(newOrderData);
    saveFallbackDb(db);
    res.status(201).json({ success: true, order: newOrderData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  const { status, statusStep, progress, deliveryTime } = req.body;
  try {
    if (isMongoConnected) {
      const updated = await Order.findOneAndUpdate(
        { id: req.params.id },
        {
          ...(status && { status }),
          ...(statusStep && { statusStep }),
          ...(progress !== undefined && { progress }),
          ...(deliveryTime && { deliveryTime }),
          updatedAt: new Date()
        },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: "Order not found" });
      return res.json({ success: true, order: updated });
    }

    const db = getFallbackDb();
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) order.status = status;
    if (statusStep) order.statusStep = statusStep;
    if (progress !== undefined) order.progress = progress;
    if (deliveryTime) order.deliveryTime = deliveryTime;
    saveFallbackDb(db);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;