import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, default: "9138004800" },
  whatsapp: { type: String, default: "919138004800" },
  city: { type: String, required: true },
  state: { type: String, required: true },
  tags: [String],
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 25 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  openingTime: String,
  status: { type: String, default: "Active" },
  priceList: [mongoose.Schema.Types.Mixed]
});

export const Store = mongoose.model("Store", storeSchema);