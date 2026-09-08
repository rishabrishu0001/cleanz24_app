import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  unit: String
});

const driverSchema = new mongoose.Schema({
  id: String,
  name: String,
  phone: String,
  rating: String,
  vehicle: String
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, default: "usr_rishab" },
  customerName: { type: String, default: "Rishab Singh" },
  customerPhone: { type: String, default: "+91 9310590680" },
  statusStep: { type: Number, default: 1 },
  status: { type: String, default: "Pickup Scheduled" },
  progress: { type: Number, default: 10 },
  deliveryTime: { type: String, default: "Tomorrow by 06:00 PM" },
  pickupDate: { type: String, default: "Today" },
  pickupSlot: { type: String, default: "11:30 AM" },
  address: { type: String, default: "Sector 94, Noida" },
  studioId: { type: Number, default: 1 },
  studioName: { type: String, default: "Cleanz24 - Sector 41 Noida" },
  driver: driverSchema,
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "UPI / COD" },
  paymentStatus: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", orderSchema);