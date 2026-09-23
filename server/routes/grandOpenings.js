import express from "express";
import { GrandOpening, isMongoConnected, getFallbackDb, saveFallbackDb } from "../db.js";

const router = express.Router();

// GET /api/grand-openings - Fetch active store openings (or all for admin if ?all=true)
router.get("/", async (req, res) => {
  const { all } = req.query;
  const includeAll = all === "true" || all === "1";

  try {
    if (isMongoConnected) {
      const filter = includeAll ? {} : { isActive: true };
      const openings = await GrandOpening.find(filter).sort({ displayOrder: 1, createdAt: -1 });
      return res.json({ count: openings.length, grandOpenings: openings });
    }

    const db = getFallbackDb();
    let openings = db.grandOpenings || [];
    if (!includeAll) {
      openings = openings.filter(o => o.isActive !== false);
    }
    return res.json({ count: openings.length, grandOpenings: openings });
  } catch (err) {
    console.error("Fetch grand openings error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/grand-openings/:id - Fetch single opening by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const opening = await GrandOpening.findOne({ id });
      if (!opening) return res.status(404).json({ error: "Store opening not found" });
      return res.json({ success: true, grandOpening: opening });
    }

    const db = getFallbackDb();
    const opening = (db.grandOpenings || []).find(o => o.id === id);
    if (!opening) return res.status(404).json({ error: "Store opening not found" });
    return res.json({ success: true, grandOpening: opening });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/grand-openings - Create new Grand Opening announcement
router.post("/", async (req, res) => {
  const {
    storeName,
    address,
    city,
    state,
    openingDate,
    openingTime,
    specialOffer,
    contactPhone,
    badgeText,
    isActive,
    displayOrder
  } = req.body;

  if (!storeName || !address || !city || !openingDate) {
    return res.status(400).json({
      error: "storeName, address, city, and openingDate are required"
    });
  }

  const newId = `opening_${Date.now()}`;
  const newOpening = {
    id: newId,
    storeName: storeName.trim(),
    address: address.trim(),
    city: city.trim(),
    state: state?.trim() || "Delhi NCR",
    openingDate: openingDate.trim(),
    openingTime: openingTime?.trim() || "10:00 AM IST",
    specialOffer: specialOffer?.trim() || "Flat 20% OFF on First 100 Orders & Free Shoe Spa",
    contactPhone: contactPhone?.trim() || "+91 91380 04800",
    badgeText: badgeText?.trim() || "🎉 GRAND OPENING",
    isActive: isActive !== false,
    displayOrder: Number(displayOrder) || 0,
    createdAt: new Date().toISOString()
  };

  try {
    if (isMongoConnected) {
      const created = await GrandOpening.create(newOpening);
      return res.status(201).json({ success: true, grandOpening: created });
    }

    const db = getFallbackDb();
    if (!db.grandOpenings) db.grandOpenings = [];
    db.grandOpenings.unshift(newOpening);
    saveFallbackDb(db);
    return res.status(201).json({ success: true, grandOpening: newOpening });
  } catch (err) {
    console.error("Create grand opening error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/grand-openings/:id - Update existing announcement
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (isMongoConnected) {
      const updated = await GrandOpening.findOneAndUpdate(
        { id },
        { $set: updates },
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: "Store opening not found" });
      return res.json({ success: true, grandOpening: updated });
    }

    const db = getFallbackDb();
    if (!db.grandOpenings) db.grandOpenings = [];
    const idx = db.grandOpenings.findIndex(o => o.id === id);
    if (idx === -1) return res.status(404).json({ error: "Store opening not found" });

    db.grandOpenings[idx] = { ...db.grandOpenings[idx], ...updates };
    saveFallbackDb(db);
    return res.json({ success: true, grandOpening: db.grandOpenings[idx] });
  } catch (err) {
    console.error("Update grand opening error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/grand-openings/:id/toggle - Toggle active/inactive status
router.patch("/:id/toggle", async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const current = await GrandOpening.findOne({ id });
      if (!current) return res.status(404).json({ error: "Store opening not found" });

      current.isActive = !current.isActive;
      await current.save();
      return res.json({ success: true, grandOpening: current });
    }

    const db = getFallbackDb();
    if (!db.grandOpenings) db.grandOpenings = [];
    const item = db.grandOpenings.find(o => o.id === id);
    if (!item) return res.status(404).json({ error: "Store opening not found" });

    item.isActive = !item.isActive;
    saveFallbackDb(db);
    return res.json({ success: true, grandOpening: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/grand-openings/:id - Delete announcement
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (isMongoConnected) {
      const deleted = await GrandOpening.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: "Store opening not found" });
      return res.json({ success: true, message: "Announcement deleted", grandOpening: deleted });
    }

    const db = getFallbackDb();
    if (!db.grandOpenings) db.grandOpenings = [];
    const prevCount = db.grandOpenings.length;
    db.grandOpenings = db.grandOpenings.filter(o => o.id !== id);
    if (db.grandOpenings.length === prevCount) {
      return res.status(404).json({ error: "Store opening not found" });
    }
    saveFallbackDb(db);
    return res.json({ success: true, message: "Announcement deleted" });
  } catch (err) {
    console.error("Delete grand opening error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
