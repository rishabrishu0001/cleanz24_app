import express from "express";
import { Store, isMongoConnected, getFallbackDb, saveFallbackDb } from "../db.js";

const router = express.Router();

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/stores
router.get("/", async (req, res) => {
  const { city, search } = req.query;
  try {
    if (isMongoConnected) {
      const query = {};
      if (city && city !== "All") query.city = new RegExp(city, "i");
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { address: new RegExp(search, "i") },
          { city: new RegExp(search, "i") }
        ];
      }
      const stores = await Store.find(query);
      return res.json({ count: stores.length, stores });
    }

    const db = getFallbackDb();
    let stores = db.stores;
    if (city && city !== "All") {
      stores = stores.filter(s => s.city && s.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      stores = stores.filter(
        s => (s.name && s.name.toLowerCase().includes(q)) ||
             (s.address && s.address.toLowerCase().includes(q)) ||
             (s.city && s.city.toLowerCase().includes(q))
      );
    }
    res.json({ count: stores.length, stores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stores/nearby
router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "lat and lng query params are required" });

  const uLat = parseFloat(lat);
  const uLng = parseFloat(lng);

  try {
    let stores = [];
    if (isMongoConnected) {
      stores = await Store.find({ lat: { $exists: true }, lng: { $exists: true } });
    } else {
      stores = getFallbackDb().stores;
    }

    const storesWithDistance = stores
      .filter(s => s.lat && s.lng)
      .map(s => {
        const item = s.toObject ? s.toObject() : s;
        const distanceKm = getDistanceKm(uLat, uLng, item.lat, item.lng);
        return {
          ...item,
          distanceKm: Math.round(distanceKm * 10) / 10,
          distanceText: distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${(Math.round(distanceKm * 10) / 10).toFixed(1)} km`
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      userCoords: { lat: uLat, lng: uLng },
      nearest: storesWithDistance[0] || null,
      stores: storesWithDistance.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Default standard price list for newly created franchise studios
const DEFAULT_STUDIO_PRICE_LIST = [
  { id: 'item_1', name: 'Standard Wash & Fold', service: 'Wash & Fold', serviceKey: 'wash_fold', category: 'wash_fold', audience: 'Household', price: 49, unit: '/ kg', desc: 'Everyday hygiene wash & tumble dry' },
  { id: 'item_2', name: 'Steam Press - Formal Shirt', service: 'Steam Press', serviceKey: 'steam_iron', category: 'steam_iron', audience: 'Men', price: 29, unit: '/ pc', desc: 'Wrinkle-free Italian boiler steam finish' },
  { id: 'item_3', name: 'Steam Press - Trousers / Jeans', service: 'Steam Press', serviceKey: 'steam_iron', category: 'steam_iron', audience: 'Men', price: 45, unit: '/ pc', desc: 'Sharp crease steam press' },
  { id: 'item_4', name: '2-Piece Men / Women Suit', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Men', price: 399, unit: '/ suit', desc: 'Gentle hydrocarbon organic dry cleaning' },
  { id: 'item_5', name: 'Silk / Designer Saree Care', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Women', price: 299, unit: '/ saree', desc: 'Delicate fabric care with roll polish' },
  { id: 'item_6', name: 'Heavy Winter Blanket / Quilt', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Household', price: 399, unit: '/ item', desc: 'Anti-bacterial allergen wash' },
  { id: 'item_7', name: 'Premium Kurta / Sherwani', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Men', price: 249, unit: '/ pc', desc: 'Festive & ethnic fabric rejuvenation' },
  { id: 'item_8', name: 'Sneakers & Leather Shoe Spa', service: 'Shoe Spa', serviceKey: 'shoe_spa', category: 'shoe_spa', audience: 'Men', price: 349, unit: '/ pair', desc: 'Deep sole & upper cleansing + deodorizing' },
  { id: 'item_9', name: 'Blackout Window Curtains', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Household', price: 149, unit: '/ panel', desc: 'Dust & stain extraction dry cleaning' }
];

// POST /api/stores - Create new store in MongoDB Atlas
router.post("/", async (req, res) => {
  const { name, address, city, state, phone, whatsapp, lat, lng, openingTime, tags, status, rating, reviews, priceList } = req.body;
  if (!name || !address || !city) {
    return res.status(400).json({ error: "Store name, address, and city are required" });
  }

  try {
    const storeId = Date.now();
    const finalPriceList = Array.isArray(priceList) && priceList.length > 0 ? priceList : DEFAULT_STUDIO_PRICE_LIST;
    const newStoreData = {
      id: storeId,
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      state: (state || "Uttar Pradesh").trim(),
      phone: (phone || "9138004800").trim(),
      whatsapp: (whatsapp || "919138004800").trim(),
      lat: parseFloat(lat) || 28.5445,
      lng: parseFloat(lng) || 77.3292,
      openingTime: openingTime || "08:00 AM - 09:00 PM",
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' && tags.trim() ? tags.split(',').map(t => t.trim()) : ["Dry Cleaning", "Wash & Fold", "Steam Press"]),
      rating: parseFloat(rating) || 4.8,
      reviews: parseInt(reviews, 10) || 12,
      status: status || "Active",
      priceList: finalPriceList
    };

    if (isMongoConnected) {
      const createdStore = await Store.create(newStoreData);
      console.log(`✅ New store '${createdStore.name}' (ID: ${storeId}) created in MongoDB Atlas with ${finalPriceList.length} price list items!`);
      return res.status(201).json({ success: true, store: createdStore });
    }

    const db = getFallbackDb();
    db.stores.unshift(newStoreData);
    saveFallbackDb(db);
    res.status(201).json({ success: true, store: newStoreData });
  } catch (err) {
    console.error("Store creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stores/:id/price-list - Get price list for a specific store
router.get("/:id/price-list", async (req, res) => {
  const rawId = req.params.id;
  const numId = Number(rawId);

  try {
    if (isMongoConnected) {
      let query = [];
      if (!isNaN(numId)) query.push({ id: numId });
      query.push({ id: rawId });
      if (rawId.match(/^[0-9a-fA-F]{24}$/)) {
        query.push({ _id: rawId });
      }
      const store = await Store.findOne({ $or: query });
      if (!store) return res.status(404).json({ error: "Store not found" });
      const list = (Array.isArray(store.priceList) && store.priceList.length > 0) ? store.priceList : DEFAULT_STUDIO_PRICE_LIST;
      return res.json({ success: true, storeName: store.name, priceList: list });
    }

    const db = getFallbackDb();
    const store = db.stores.find(s => s.id === numId || s.id === rawId || s._id === rawId);
    if (!store) return res.status(404).json({ error: "Store not found" });
    const list = (Array.isArray(store.priceList) && store.priceList.length > 0) ? store.priceList : DEFAULT_STUDIO_PRICE_LIST;
    res.json({ success: true, storeName: store.name, priceList: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/stores/:id/price-list - Update price list for a specific store
router.put("/:id/price-list", async (req, res) => {
  const rawId = req.params.id;
  const numId = Number(rawId);
  const { priceList } = req.body;

  if (!Array.isArray(priceList)) {
    return res.status(400).json({ error: "priceList must be an array of items" });
  }

  try {
    if (isMongoConnected) {
      let query = [];
      if (!isNaN(numId)) query.push({ id: numId });
      query.push({ id: rawId });
      if (rawId.match(/^[0-9a-fA-F]{24}$/)) {
        query.push({ _id: rawId });
      }
      const updatedStore = await Store.findOneAndUpdate(
        { $or: query },
        { $set: { priceList } },
        { new: true }
      );
      if (!updatedStore) return res.status(404).json({ error: "Store not found" });
      console.log(`🏷️ Price list updated for '${updatedStore.name}' (${priceList.length} items) in MongoDB Atlas!`);
      return res.json({ success: true, store: updatedStore, priceList: updatedStore.priceList });
    }

    const db = getFallbackDb();
    const index = db.stores.findIndex(s => s.id === numId || s.id === rawId || s._id === rawId);
    if (index === -1) return res.status(404).json({ error: "Store not found" });
    db.stores[index].priceList = priceList;
    saveFallbackDb(db);
    res.json({ success: true, store: db.stores[index], priceList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/stores/:id - Update store
router.put("/:id", async (req, res) => {
  const rawId = req.params.id;
  const numId = Number(rawId);
  const updates = req.body;

  try {
    if (isMongoConnected) {
      let query = [];
      if (!isNaN(numId)) query.push({ id: numId });
      query.push({ id: rawId });
      if (rawId.match(/^[0-9a-fA-F]{24}$/)) {
        query.push({ _id: rawId });
      }
      const updatedStore = await Store.findOneAndUpdate({ $or: query }, updates, { new: true });
      if (!updatedStore) return res.status(404).json({ error: "Store not found" });
      return res.json({ success: true, store: updatedStore });
    }

    const db = getFallbackDb();
    const index = db.stores.findIndex(s => s.id === numId || s.id === rawId || s._id === rawId);
    if (index === -1) return res.status(404).json({ error: "Store not found" });
    db.stores[index] = { ...db.stores[index], ...updates };
    saveFallbackDb(db);
    res.json({ success: true, store: db.stores[index] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/stores/:id - Delete store
router.delete("/:id", async (req, res) => {
  const rawId = req.params.id;
  const numId = Number(rawId);

  try {
    if (isMongoConnected) {
      let query = [];
      if (!isNaN(numId)) query.push({ id: numId });
      query.push({ id: rawId });
      if (rawId.match(/^[0-9a-fA-F]{24}$/)) {
        query.push({ _id: rawId });
      }
      const deletedStore = await Store.findOneAndDelete({ $or: query });
      if (!deletedStore) return res.status(404).json({ error: "Store not found" });
      console.log(`🗑️ Store '${deletedStore.name}' (ID: ${deletedStore.id}) deleted from MongoDB Atlas!`);
      return res.json({ success: true, message: "Store deleted successfully from MongoDB Atlas" });
    }

    const db = getFallbackDb();
    db.stores = db.stores.filter(s => s.id !== numId && s.id !== rawId && s._id !== rawId);
    saveFallbackDb(db);
    res.json({ success: true, message: "Store deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;