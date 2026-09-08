import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);