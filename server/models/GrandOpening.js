import mongoose from "mongoose";

const grandOpeningSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "Delhi NCR" },
  openingDate: { type: String, required: true }, // e.g. "October 25, 2026"
  openingTime: { type: String, required: true }, // e.g. "10:00 AM IST"
  specialOffer: { type: String, default: "Flat 20% OFF on First 100 Orders & Free Shoe Spa" },
  contactPhone: { type: String, default: "+91 91380 04800" },
  badgeText: { type: String, default: "🎉 GRAND OPENING" },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const GrandOpening = mongoose.model("GrandOpening", grandOpeningSchema);
