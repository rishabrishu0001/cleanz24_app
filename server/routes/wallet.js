import express from "express";
import { User, WalletTransaction, isMongoConnected, getFallbackDb, saveFallbackDb } from "../db.js";

const router = express.Router();

// GET /api/wallet/balance
router.get("/balance", async (req, res) => {
  const userId = req.query.userId || "usr_rishab";
  try {
    if (isMongoConnected) {
      const user = await User.findOne({ id: userId });
      return res.json({ balance: user ? user.walletBalance : 0 });
    }
    const user = getFallbackDb().users.find(u => u.id === userId);
    res.json({ balance: user ? user.walletBalance : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/wallet/topup
router.post("/topup", async (req, res) => {
  const { userId, amount, paymentMethod } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  try {
    if (isMongoConnected) {
      const user = await User.findOneAndUpdate(
        { id: userId || "usr_rishab" },
        { $inc: { walletBalance: Number(amount) } },
        { new: true }
      );
      if (!user) return res.status(404).json({ error: "User not found" });

      const txn = await WalletTransaction.create({
        id: "tx_" + Date.now(),
        userId: user.id,
        type: "credit",
        amount: Number(amount),
        description: `Wallet Top-up via ${paymentMethod || "UPI"}`
      });

      return res.json({ success: true, balance: user.walletBalance, transaction: txn });
    }

    const db = getFallbackDb();
    const user = db.users.find(u => u.id === (userId || "usr_rishab"));
    if (!user) return res.status(404).json({ error: "User not found" });

    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    const txn = {
      id: "tx_" + Date.now(),
      userId: user.id,
      type: "credit",
      amount: Number(amount),
      description: `Wallet Top-up via ${paymentMethod || "UPI"}`,
      timestamp: new Date().toISOString()
    };
    db.walletTransactions.unshift(txn);
    saveFallbackDb(db);
    res.json({ success: true, balance: user.walletBalance, transaction: txn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/wallet/transactions
router.get("/transactions", async (req, res) => {
  const userId = req.query.userId || "usr_rishab";
  try {
    if (isMongoConnected) {
      const txns = await WalletTransaction.find({ userId }).sort({ timestamp: -1 });
      return res.json({ transactions: txns });
    }
    const txns = getFallbackDb().walletTransactions.filter(t => t.userId === userId);
    res.json({ transactions: txns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;