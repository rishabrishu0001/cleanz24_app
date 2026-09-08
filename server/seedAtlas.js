import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Store } from "./models/Store.js";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";
import { Valet } from "./models/Valet.js";
import { WalletTransaction } from "./models/WalletTransaction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is not defined in server/.env");
  console.log("👉 Please add your MongoDB Atlas URI in server/.env:");
  console.log("   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cleanz24?retryWrites=true&w=majority");
  process.exit(1);
}

const STORES_PATH = path.join(__dirname, "..", "src", "data", "stores.json");
const DB_JSON_PATH = path.join(__dirname, "data", "db.json");

async function seedDatabase() {
  const maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
  console.log("\n=======================================================");
  console.log("🚀 Cleanz24 MongoDB Atlas Database Seeder & Migrator");
  console.log("=======================================================");
  console.log(`📡 Connecting to: ${maskedUri} ...`);

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // 1. Seed Stores
    let insertedStoresCount = 0;
    if (fs.existsSync(STORES_PATH)) {
      const storesData = JSON.parse(fs.readFileSync(STORES_PATH, "utf8"));
      await Store.deleteMany({});
      const insertedStores = await Store.insertMany(storesData);
      insertedStoresCount = insertedStores.length;
      console.log(`🏬 Seeded ${insertedStoresCount} Cleanz24 Studios into Atlas Collection 'stores'`);
    } else {
      console.warn("⚠️ Stores file not found at:", STORES_PATH);
    }

    // 2. Seed Users
    let usersData = [
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
      },
      {
        id: "usr_aman",
        name: "Aman Sharma",
        phone: "+91 9876543210",
        email: "aman.sharma@example.com",
        role: "customer",
        walletBalance: 500,
        addresses: [
          {
            id: "addr_aman_home",
            title: "Home",
            badge: "Primary",
            address: "Sector 137, Supertech Mart, Noida",
            phone: "9876543210",
            lat: 28.5134,
            lng: 77.4042,
            type: "home"
          }
        ]
      }
    ];

    // Deduplicate users by both id and normalized phone
    const existingIds = new Set();
    const existingPhones = new Set();
    const uniqueUsers = [];

    // Helper to add if unique
    const tryAddUser = (u) => {
      const normPhone = (u.phone || '').replace(/\s+/g, '');
      if (u.id && !existingIds.has(u.id) && !existingPhones.has(normPhone)) {
        existingIds.add(u.id);
        if (normPhone) existingPhones.add(normPhone);
        uniqueUsers.push(u);
      }
    };

    usersData.forEach(tryAddUser);

    if (fs.existsSync(DB_JSON_PATH)) {
      try {
        const localDb = JSON.parse(fs.readFileSync(DB_JSON_PATH, "utf8"));
        if (localDb.users && localDb.users.length > 0) {
          localDb.users.forEach(tryAddUser);
        }
      } catch (err) {
        console.warn("Notice: could not parse local db.json:", err.message);
      }
    }

    await User.deleteMany({});
    const insertedUsers = await User.insertMany(uniqueUsers);
    console.log(`👤 Seeded ${insertedUsers.length} Users (including Admin & Customers) into 'users'`);

    // 3. Seed Valets
    const valetsData = [
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
    ];

    await Valet.deleteMany({});
    const insertedValets = await Valet.insertMany(valetsData);
    console.log(`🛵 Seeded ${insertedValets.length} Verified Valets into 'valets'`);

    // 4. Seed Orders
    const sampleOrders = [
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
      },
      {
        id: "CZ-912044",
        customerId: "usr_aman",
        customerName: "Aman Sharma",
        customerPhone: "+91 9876543210",
        statusStep: 2,
        deliveryTime: "Tomorrow by 04:00 PM",
        status: "Pickup Scheduled",
        progress: 25,
        pickupDate: "Today",
        pickupSlot: "04:00 PM - 06:00 PM",
        address: "Sector 137, Supertech Mart, Noida",
        studioId: 2,
        studioName: "Cleanz24 - Sector 137 Noida",
        items: [
          { id: "dc_shirt", name: "Shirt Full Sleeves (Dry Clean)", price: 80, quantity: 4, unit: "/ pc" }
        ],
        totalPrice: 320,
        paymentStatus: "Pending"
      }
    ];

    await Order.deleteMany({});
    const insertedOrders = await Order.insertMany(sampleOrders);
    console.log(`📦 Seeded ${insertedOrders.length} Sample Orders into 'orders'`);

    console.log("\n=======================================================");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY IN ATLAS!");
    console.log("=======================================================");
    console.log("Collections populated:");
    console.log(` • Stores:  ${insertedStoresCount}`);
    console.log(` • Users:   ${insertedUsers.length}`);
    console.log(` • Valets:  ${insertedValets.length}`);
    console.log(` • Orders:  ${insertedOrders.length}`);
    console.log("=======================================================\n");

  } catch (error) {
    console.error("\n❌ MongoDB Atlas Seeding Failed:");
    console.error(error.message);
    console.error("\n💡 Tips:");
    console.error("1. Make sure your IP address is whitelisted in MongoDB Atlas (Network Access -> Add 0.0.0.0/0).");
    console.error("2. Verify the username and password in MONGODB_URI.");
    console.error("3. Ensure the database user has 'readWriteAnyDatabase' permissions.");
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
}

seedDatabase();
