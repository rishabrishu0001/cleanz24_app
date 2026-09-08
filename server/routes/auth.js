import express from "express";
import { User, WalletTransaction, isMongoConnected, getFallbackDb, saveFallbackDb } from "../db.js";
import { sendWhatsAppOtp } from "../services/whatsappService.js";
import { sendSmsOtp } from "../services/smsService.js";

const router = express.Router();

// In-memory OTP storage with 5-min TTL
const otpStore = new Map();

// POST /api/auth/quick-login (Instant 1-Click Login / Signup without OTP blocking)
router.post("/quick-login", async (req, res) => {
  const { phone, name, email, address } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number" });
  }

  const finalName = name && name.trim() && name.trim() !== "Customer" ? name.trim() : "Customer";

  try {
    if (isMongoConnected) {
      let user = await User.findOne({ phone: { $regex: cleanPhone } });
      if (!user) {
        user = await User.create({
          id: "usr_" + Date.now(),
          name: finalName,
          phone: `+91 ${cleanPhone}`,
          email: email || "",
          role: "customer",
          walletBalance: 500,
          addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "Saved", address, phone: `+91 ${cleanPhone}`, type: "home" }] : []
        });
        await WalletTransaction.create({
          id: "tx_" + Date.now(),
          userId: user.id,
          type: "credit",
          amount: 500,
          description: "Welcome Bonus Cashback"
        });
      } else {
        if (finalName !== "Customer") {
          user.name = finalName;
        }
        if (email) user.email = email;
        await user.save();
      }
      return res.json({ success: true, user, message: "Logged in successfully" });
    }

    // Fallback mode
    const db = getFallbackDb();
    let user = db.users.find(u => u.phone && u.phone.includes(cleanPhone));
    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        name: finalName,
        phone: `+91 ${cleanPhone}`,
        email: email || "",
        role: "customer",
        walletBalance: 500,
        addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "Saved", address, phone: `+91 ${cleanPhone}`, type: "home" }] : []
      };
      db.users.push(user);
      saveFallbackDb(db);
    } else {
      if (finalName !== "Customer") {
        user.name = finalName;
      }
      if (email) user.email = email;
      saveFallbackDb(db);
    }
    return res.json({ success: true, user, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/send-whatsapp-otp
router.post("/send-whatsapp-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number" });
  }

  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(cleanPhone, { otp, expiresAt });

  try {
    const result = await sendWhatsAppOtp(cleanPhone, otp);
    res.json({
      success: true,
      message: "Verification code sent to your WhatsApp number",
      phone: `+91 ${cleanPhone}`,
      expiresInSeconds: 300,
      ...(result.demoOtp && { demoOtp: result.demoOtp })
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send WhatsApp OTP" });
  }
});

// POST /api/auth/verify-whatsapp-otp
router.post("/verify-whatsapp-otp", async (req, res) => {
  const { phone, otp, name, email, address } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP are required" });

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const record = otpStore.get(cleanPhone);

  // Validate OTP (allow test OTP 1234, 123456 or matching active OTP)
  const isMatch = (record && record.otp === String(otp).trim() && Date.now() < record.expiresAt) || String(otp).trim() === "1234" || String(otp).trim() === "123456" || String(otp).trim() === "941200";

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid or expired verification code" });
  }

  // Clear OTP
  otpStore.delete(cleanPhone);

  try {
    if (isMongoConnected) {
      let user = await User.findOne({ phone: { $regex: cleanPhone } });
      if (!user) {
        user = await User.create({
          id: "usr_" + Date.now(),
          name: name || "Customer",
          phone: `+91 ${cleanPhone}`,
          email: email || "",
          role: "customer",
          walletBalance: 500,
          addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "Saved", address, phone: `+91 ${cleanPhone}`, type: "home" }] : []
        });
      } else if (name && name.trim() && name.trim() !== "Customer") {
        user.name = name.trim();
        if (email) user.email = email;
        await user.save();
      }
      return res.json({ success: true, user, message: "Logged in successfully" });
    }

    const db = getFallbackDb();
    let user = db.users.find(u => u.phone && u.phone.includes(cleanPhone));
    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        name: name || "Customer",
        phone: `+91 ${cleanPhone}`,
        email: email || "",
        role: "customer",
        walletBalance: 500,
        addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "Saved", address, phone: `+91 ${cleanPhone}`, type: "home" }] : []
      };
      db.users.push(user);
      saveFallbackDb(db);
    } else if (name && name.trim()) {
      user.name = name.trim();
      if (email) user.email = email;
      saveFallbackDb(db);
    }
    res.json({ success: true, user, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/send-sms-otp
router.post("/send-sms-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number" });
  }

  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(cleanPhone, { otp, expiresAt });

  try {
    const result = await sendSmsOtp(cleanPhone, otp);
    res.json({
      success: true,
      message: "Verification code sent to your mobile number via SMS",
      phone: `+91 ${cleanPhone}`,
      expiresInSeconds: 300,
      ...(result.demoOtp && { demoOtp: result.demoOtp })
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send SMS OTP" });
  }
});

// POST /api/auth/verify-sms-otp
router.post("/verify-sms-otp", async (req, res) => {
  const { phone, otp, name, email, address } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP are required" });

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const record = otpStore.get(cleanPhone);

  // Validate OTP (allow test OTP 1234, 123456, 941200 or matching active OTP)
  const isMatch = (record && record.otp === String(otp).trim() && Date.now() < record.expiresAt) ||
                  String(otp).trim() === "1234" ||
                  String(otp).trim() === "123456" ||
                  String(otp).trim() === "941200";

  if (!isMatch) {
    return res.status(400).json({ error: "Invalid or expired verification code" });
  }

  // Clear OTP
  otpStore.delete(cleanPhone);

  try {
    if (isMongoConnected) {
      let user = await User.findOne({ phone: { $regex: cleanPhone } });
      if (!user) {
        user = await User.create({
          id: "usr_" + Date.now(),
          name: name || "Customer",
          phone: `+91 ${cleanPhone}`,
          email: email || "",
          role: "customer",
          walletBalance: 500,
          addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "Saved", address, phone: `+91 ${cleanPhone}`, type: "home" }] : []
        });
      } else if (name && name.trim() && name.trim() !== "Customer") {
        user.name = name.trim();
        if (email) user.email = email;
        await user.save();
      }
      return res.json({ success: true, user, message: "Logged in successfully" });
    }

    const db = getFallbackDb();
    let user = db.users.find(u => u.phone && u.phone.includes(cleanPhone));
    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        name: name || "Customer",
        phone: `+91 ${cleanPhone}`,
        email: email || "",
        role: "customer",
        walletBalance: 500,
        addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "Saved", address, phone: `+91 ${cleanPhone}`, type: "home" }] : []
      };
      db.users.push(user);
      saveFallbackDb(db);
    } else if (name && name.trim() && name.trim() !== "Customer") {
      user.name = name.trim();
      if (email) user.email = email;
      saveFallbackDb(db);
    }
    res.json({ success: true, user, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { phone, email, name } = req.body;
  const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";

  try {
    if (isMongoConnected) {
      let user = await User.findOne({
        $or: [
          ...(cleanPhone ? [{ phone: { $regex: cleanPhone } }] : []),
          ...(email ? [{ email: email.toLowerCase() }] : [])
        ]
      });

      if (!user) {
        user = await User.create({
          id: "usr_" + Date.now(),
          name: name || "Customer",
          phone: phone || "+91 9999999999",
          email: email || "",
          role: "customer",
          walletBalance: 500,
          addresses: []
        });

        await WalletTransaction.create({
          id: "tx_" + Date.now(),
          userId: user.id,
          type: "credit",
          amount: 500,
          description: "Welcome Bonus Cashback"
        });
      } else if (name && name.trim() && name !== 'Customer') {
        user.name = name.trim();
        await user.save();
      }

      return res.json({ success: true, user });
    }

    // Fallback mode
    const db = getFallbackDb();
    let user = db.users.find(
      u => (cleanPhone && u.phone && u.phone.includes(cleanPhone)) ||
           (email && u.email && u.email.toLowerCase() === email.toLowerCase())
    );

    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        name: name || "Customer",
        phone: phone || "+91 9999999999",
        email: email || "",
        role: "customer",
        walletBalance: 500,
        addresses: []
      };
      db.users.push(user);
      saveFallbackDb(db);
    } else if (name && name.trim() && name !== 'Customer') {
      user.name = name.trim();
      saveFallbackDb(db);
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, phone, email, address } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone are required" });
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);

  try {
    if (isMongoConnected) {
      let existing = await User.findOne({ phone: { $regex: cleanPhone } });
      if (existing) return res.status(400).json({ error: "User already exists with this phone" });

      const user = await User.create({
        id: "usr_" + Date.now(),
        name,
        phone,
        email: email || "",
        role: "customer",
        walletBalance: 500,
        addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "New", address, phone, type: "home" }] : []
      });

      await WalletTransaction.create({
        id: "tx_" + Date.now(),
        userId: user.id,
        type: "credit",
        amount: 500,
        description: "Welcome Bonus Cashback"
      });

      return res.status(201).json({ success: true, user });
    }

    const db = getFallbackDb();
    let existing = db.users.find(u => u.phone.includes(cleanPhone));
    if (existing) return res.status(400).json({ error: "User already exists with this phone" });

    const user = {
      id: "usr_" + Date.now(),
      name,
      phone,
      email: email || "",
      role: "customer",
      walletBalance: 500,
      addresses: address ? [{ id: "addr_" + Date.now(), title: "Home", badge: "New", address, phone, type: "home" }] : []
    };
    db.users.push(user);
    saveFallbackDb(db);
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const userId = req.query.userId || "usr_rishab";
  try {
    if (isMongoConnected) {
      const user = await User.findOne({ id: userId });
      return res.json({ user: user || null });
    }
    const db = getFallbackDb();
    const user = db.users.find(u => u.id === userId) || db.users[0];
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/addresses
router.get("/addresses", async (req, res) => {
  const userId = req.query.userId || "usr_rishab";
  try {
    if (isMongoConnected) {
      const user = await User.findOne({ id: userId });
      return res.json({ addresses: user ? user.addresses : [] });
    }
    const db = getFallbackDb();
    const user = db.users.find(u => u.id === userId);
    res.json({ addresses: user ? user.addresses : [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/addresses
router.post("/addresses", async (req, res) => {
  const { userId, title, address, phone, lat, lng, type } = req.body;
  if (!address) return res.status(400).json({ error: "Address is required" });

  const newAddr = {
    id: "addr_" + Date.now(),
    title: title || "Custom",
    badge: "Saved",
    address,
    phone: phone || "+91 9310590680",
    lat: lat || 28.5445,
    lng: lng || 77.3292,
    type: (type || "home").toLowerCase()
  };

  try {
    if (isMongoConnected) {
      const user = await User.findOne({ id: userId || "usr_rishab" });
      if (!user) return res.status(404).json({ error: "User not found" });
      user.addresses.unshift(newAddr);
      await user.save();
      return res.status(201).json({ success: true, address: newAddr, addresses: user.addresses });
    }

    const db = getFallbackDb();
    const user = db.users.find(u => u.id === (userId || "usr_rishab"));
    if (!user) return res.status(404).json({ error: "User not found" });
    user.addresses.unshift(newAddr);
    saveFallbackDb(db);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/profile
router.put("/profile", async (req, res) => {
  const { userId, phone, name, email } = req.body;
  const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";

  try {
    if (isMongoConnected) {
      let user = null;
      if (userId) user = await User.findOne({ id: userId });
      if (!user && cleanPhone) user = await User.findOne({ phone: { $regex: cleanPhone } });

      if (user) {
        if (name && name.trim()) user.name = name.trim();
        if (email && email.trim()) user.email = email.trim();
        await user.save();
        return res.json({ success: true, user });
      }
    }

    const db = getFallbackDb();
    let user = db.users.find(u => (userId && u.id === userId) || (cleanPhone && u.phone && u.phone.includes(cleanPhone)));
    if (user) {
      if (name && name.trim()) user.name = name.trim();
      if (email && email.trim()) user.email = email.trim();
      saveFallbackDb(db);
      return res.json({ success: true, user });
    }

    res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;