import mongoose from "mongoose";

const valetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: String, default: "4.9 ⭐" },
  vehicle: { type: String, default: "Cleanz EV Van" },
  status: { type: String, default: "Active" },
  currentLocation: { type: String, default: "Sector 41, Noida" },
  assignedOrdersCount: { type: Number, default: 0 }
});

export const Valet = mongoose.model("Valet", valetSchema);