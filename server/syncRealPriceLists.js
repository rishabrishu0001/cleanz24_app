import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Store } from "./models/Store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set");
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, "..", "src", "data");

function loadJsonSafe(filename) {
  const fullPath = path.join(DATA_DIR, filename);
  if (fs.existsSync(fullPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.warn(`Could not parse ${filename}:`, e.message);
    }
  return null;
}

// Load all real catalogs
const CATALOGS = {
  noida137: loadJsonSafe("noida137_prices.json"),
  noida41: loadJsonSafe("noida41_prices.json"),
  niralaEstate: loadJsonSafe("nirala_estate_prices.json"),
  vaishali: loadJsonSafe("vaishali_prices.json"),
  amritsar: loadJsonSafe("amritsar_prices.json"),
  patiala: loadJsonSafe("patiala_prices.json"),
  kharar: loadJsonSafe("kharar_prices.json"),
  udaipur: loadJsonSafe("udaipur_prices.json"),
  bhilwara: loadJsonSafe("bhilwara_prices.json"),
  sanchore: loadJsonSafe("sanchore_prices.json"),
  siwara: loadJsonSafe("siwara_prices.json"),
  bhopal: loadJsonSafe("bhopal_prices.json"),
  thane: loadJsonSafe("thane_prices.json"),
  alibag: loadJsonSafe("alibag_prices.json"),
  kokapet: loadJsonSafe("kokapet_prices.json"),
  kondapur: loadJsonSafe("kondapur_prices.json"),
  gopanpally: loadJsonSafe("gopanpally_prices.json"),
  narsingi: loadJsonSafe("narsingi_prices.json"),
  beeramguda: loadJsonSafe("beeramguda_prices.json"),
  gachibowli: loadJsonSafe("gachibowli_prices.json"),
  ibnagar: loadJsonSafe("ibnagar_prices.json"),
  kowkoor: loadJsonSafe("kowkoor_prices.json"),
  cuttack: loadJsonSafe("cuttack_prices.json"),
  brahmapur: loadJsonSafe("brahmapur_prices.json"),
  jeypore: loadJsonSafe("jeypore_prices.json"),
  jatni: loadJsonSafe("jatni_prices.json"),
  oldtown: loadJsonSafe("oldtown_prices.json"),
  palasuni: loadJsonSafe("palasuni_prices.json"),
  angul: loadJsonSafe("angul_prices.json"),
  roorkee: loadJsonSafe("roorkee_prices.json"),
  purnia: loadJsonSafe("purnia_prices.json"),
  nadiad: loadJsonSafe("nadiad_prices.json"),
  siliguri: loadJsonSafe("siliguri_prices.json"),
  thampanoor: loadJsonSafe("thampanoor_prices.json"),
  kazhakootam: loadJsonSafe("kazhakootam_prices.json"),
  parad: loadJsonSafe("parad_prices.json"),
  mahe: loadJsonSafe("mahe_prices.json")
};

function resolveRealCatalog(store) {
  const str = `${store.name || ''} ${store.address || ''} ${store.city || ''} ${store.state || ''}`.toLowerCase();

  if (str.includes('sector 137') || str.includes('137 noida')) return CATALOGS.noida137;
  if (str.includes('sector 41') || (str.includes('noida') && !str.includes('extension') && !str.includes('greater noida'))) return CATALOGS.noida41;
  if (str.includes('nirala') || str.includes('patwari') || str.includes('swarn nagari') || str.includes('greater noida') || str.includes('tech zone')) return CATALOGS.niralaEstate || CATALOGS.noida41;
  if (str.includes('vaishali') || str.includes('indirapuram') || str.includes('ghaziabad')) return CATALOGS.vaishali;
  if (str.includes('jeypore') || str.includes('koraput')) return CATALOGS.jeypore;
  if (str.includes('old town') || str.includes('kharakhia')) return CATALOGS.oldtown;
  if (str.includes('brahm') || str.includes('berhampur')) return CATALOGS.brahmapur;
  if (str.includes('jatni') || str.includes('khordha')) return CATALOGS.jatni;
  if (str.includes('cuttack') || str.includes('markat nagar') || str.includes('cda')) return CATALOGS.cuttack;
  if (str.includes('thampanoor') || str.includes('thyvila')) return CATALOGS.thampanoor;
  if (str.includes('kazhak') || str.includes('trivandrum')) return CATALOGS.kazhakootam;
  if (str.includes('ib nagar') || str.includes('vanasthalipuram')) return CATALOGS.ibnagar;
  if (str.includes('kowkoor') || str.includes('alwal')) return CATALOGS.kowkoor;
  if (str.includes('kondapur')) return CATALOGS.kondapur;
  if (str.includes('gopanpally') || str.includes('tellapur')) return CATALOGS.gopanpally;
  if (str.includes('kokapet')) return CATALOGS.kokapet;
  if (str.includes('narsingi')) return CATALOGS.narsingi;
  if (str.includes('roorkee') || str.includes('haridwar') || str.includes('chamoli') || str.includes('karnaprayag')) return CATALOGS.roorkee;
  if (str.includes('purnia')) return CATALOGS.purnia;
  if (str.includes('bhilwara')) return CATALOGS.bhilwara;
  if (str.includes('siwara')) return CATALOGS.siwara;
  if (str.includes('sanchore') || str.includes('jalore')) return CATALOGS.sanchore;
  if (str.includes('udaipur')) return CATALOGS.udaipur;
  if (str.includes('bhopal') || str.includes('madhya pradesh')) return CATALOGS.bhopal;
  if (str.includes('beeramguda') || str.includes('sangareddy')) return CATALOGS.beeramguda;
  if (str.includes('gachibowli')) return CATALOGS.gachibowli;
  if (str.includes('alibag') || str.includes('raigad')) return CATALOGS.alibag;
  if (str.includes('thane') || str.includes('mumbai') || str.includes('maharashtra')) return CATALOGS.thane;
  if (str.includes('amritsar') || str.includes('bathinda') || str.includes('punjab')) return CATALOGS.amritsar;
  if (str.includes('patiala')) return CATALOGS.patiala;
  if (str.includes('kharar') || str.includes('panchkula') || str.includes('chandigarh')) return CATALOGS.kharar;
  if (str.includes('nadiad') || str.includes('gujarat')) return CATALOGS.nadiad;
  if (str.includes('siliguri') || str.includes('bengal')) return CATALOGS.siliguri;
  if (str.includes('parad')) return CATALOGS.parad;
  if (str.includes('mahe')) return CATALOGS.mahe;
  if (str.includes('angul')) return CATALOGS.angul;
  if (str.includes('palasuni') || str.includes('bhubaneswar') || str.includes('odisha')) return CATALOGS.palasuni || CATALOGS.brahmapur;
  if (str.includes('kerala')) return CATALOGS.kazhakootam;
  if (str.includes('telangana') || str.includes('hyderabad')) return CATALOGS.kowkoor;

  return CATALOGS.vaishali || CATALOGS.noida41;
}

async function syncAllStorePriceLists() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log("Connected to MongoDB Atlas!");

  const stores = await Store.find({});
  console.log(`Found ${stores.length} stores in Atlas.`);

  let updatedCount = 0;
  for (const s of stores) {
    // If the store doesn't have a custom price list or only has <= 10 items (the template)
    if (!Array.isArray(s.priceList) || s.priceList.length <= 10) {
      const realCatalog = resolveRealCatalog(s);
      if (realCatalog && realCatalog.length > 0) {
        await Store.updateOne({ _id: s._id }, { $set: { priceList: realCatalog } });
        console.log(`✅ Updated '${s.name}' with ${realCatalog.length} real price list items!`);
        updatedCount++;
      }
    } else {
      console.log(`ℹ️ '${s.name}' already has ${s.priceList.length} items.`);
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} stores with their REAL price lists in MongoDB Atlas!`);
  await mongoose.disconnect();
}

syncAllStorePriceLists().catch(err => {
  console.error("Sync error:", err.message);
  process.exit(1);
});
