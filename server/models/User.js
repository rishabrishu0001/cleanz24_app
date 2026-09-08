import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: "Home" },
  badge: { type: String, default: "Saved" },
  address: { type: String, required: true },
  phone: { type: String },
  lat: { type: Number, default: 28.5445 },
  lng: { type: Number, default: 77.3292 },
  type: { type: String, default: "home" }
});

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, default: "" },
  role: { type: String, enum: ["customer", "admin", "valet"], default: "customer" },
  walletBalance: { type: Number, default: 500 },
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);