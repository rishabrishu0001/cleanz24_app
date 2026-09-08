import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";
import { Store } from "./models/Store.js";
import { Valet } from "./models/Valet.js";
import { WalletTransaction } from "./models/WalletTransaction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cleanz24";
const STORES_PATH = path.join(__dirname, "..", "src", "data", "stores.json");
const DB_JSON_PATH = path.join(__dirname, "data", "db.json");

export let isMongoConnected = false;

// Fallback JSON in-memory cache
let fallbackDb = null;
function getFallbackDb() {
  if (!fallbackDb) {
    if (fs.existsSync(DB_JSON_PATH)) {
      try {
        fallbackDb = JSON.parse(fs.readFileSync(DB_JSON_PATH, "utf8"));
      } catch {
        fallbackDb = { users: [], orders: [], stores: [], valets: [], walletTransactions: [] };
      }
    } else {
      fallbackDb = { users: [], orders: [], stores: [], valets: [], walletTransactions: [] };
    }
  }
  return fallbackDb;
}

function saveFallbackDb(data) {
  fallbackDb = data;
  try {
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Fallback save error:", err);
  }
}

// Seed initial data into MongoDB
async function seedMongoDb() {
  try {
    const storeCount = await Store.countDocuments();
    if (storeCount === 0 && fs.existsSync(STORES_PATH)) {
      const storesData = JSON.parse(fs.readFileSync(STORES_PATH, "utf8"));
      await Store.insertMany(storesData);
      console.log(` Seeded ${storesData.length} Cleanz24 studios into MongoDB`);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          id: "usr_rishab",
          name: "Rishab Singh",
          phone: "+91 9310590680",
          email: "rishabnegi333@gmail.com",
          role: "customer",
          walletBalance: 2450,
          addresses: [
            {
              id: "addr_work",
              title: "Work",
              badge: "Frequently used",
              address: "2735, 27th floor super astilis, Sector 94, Noida",
              phone: "9310590680",
              lat: 28.5445,
              lng: 77.3292,
              type: "work"
            },
            {
              id: "addr_home",
              title: "Home",
              badge: "Frequently used",
              address: "Gali no. 12 baba surdas, Sector 41, Noida",
              phone: "9138004800",
              lat: 28.5638,
              lng: 77.3627,
              type: "home"
            }
          ]
        },
        {
          id: "usr_admin",
          name: "Cleanz24 Master Admin",
          phone: "+91 9999999999",
          email: "admin@cleanz24.com",
          role: "admin",
          walletBalance: 0
        }
      ]);
      console.log(" Seeded initial users into MongoDB");
    }

    const valetCount = await Valet.countDocuments();
    if (valetCount === 0) {
      await Valet.create([
        {
          id: "valet_1",
          name: "David Santos",
          phone: "+91 91380 04800",
          rating: "4.9 ⭐",
          vehicle: "Cleanz EV Van #14",
          status: "Active",
          currentLocation: "Sector 41, Noida",
          assignedOrdersCount: 3
        },
        {
          id: "valet_2",
          name: "Amit Sharma",
          phone: "+91 98765 43210",
          rating: "4.8 ⭐",
          vehicle: "Cleanz EV Scooter #08",
          status: "Active",
          currentLocation: "Sector 94, Noida",
          assignedOrdersCount: 2
        }
      ]);
      console.log(" Seeded valets into MongoDB");
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create([
        {
          id: "CZ-849201",
          customerId: "usr_rishab",
          customerName: "Rishab Singh",
          customerPhone: "+91 9310590680",
          statusStep: 3,
          deliveryTime: "Today by 06:30 PM",
          status: "German Eco Wash & Stain Care",
          progress: 50,
          pickupDate: "Today (Aug 31)",
          pickupSlot: "11:30 AM",
          address: "Sector 41, Noida, C Block Market",
          studioId: 1,
          studioName: "Cleanz24 - Sector 41 Noida",
          driver: {
            name: "David Santos",
            phone: "+91 91380 04800",
            rating: "4.9 ⭐",
            vehicle: "Cleanz EV Van #14"
          },
          items: [
            { id: "wf_bag", name: "Standard Wash & Fold Bag", price: 49, quantity: 5, unit: "/ kg" },
            { id: "dc_suit", name: "2-Piece Men / Women Suit", price: 399, quantity: 1, unit: "/ suit" }
          ],
          totalPrice: 644,
          paymentStatus: "Paid"
        }
      ]);
      console.log(" Seeded initial orders into MongoDB");
    }
  } catch (err) {
    console.error("MongoDB seeding error:", err.message);
  }
}

// Connect to MongoDB
export async function connectDB() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@")} ...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    isMongoConnected = true;
    console.log(" MongoDB Connected Successfully!");
    await seedMongoDb();
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB Connection Error (${err.message}).`);
    console.warn(" Running in Hybrid Mode: Using local persistent store. To connect MongoDB, configure MONGODB_URI in server/.env");
  }
}

export { User, Order, Store, Valet, WalletTransaction, getFallbackDb, saveFallbackDb };