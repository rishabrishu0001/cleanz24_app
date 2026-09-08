import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VAISHALI_CATALOG } from './vaishaliCatalog.js';
import { PARAD_CATALOG } from './paradCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'mahe_price_list.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Build fallback lookup
const fallbackMap = {};
PARAD_CATALOG.forEach(item => {
  const norm = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `${item.serviceKey}_${norm}`;
  if (!fallbackMap[key]) fallbackMap[key] = item.price;
  if (!fallbackMap[norm]) fallbackMap[norm] = item.price;
});
VAISHALI_CATALOG.forEach(item => {
  const norm = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `${item.serviceKey}_${norm}`;
  if (!fallbackMap[key]) fallbackMap[key] = item.price;
  if (!fallbackMap[norm]) fallbackMap[norm] = item.price;
});

const items = [];
const seenKeys = new Set();
let skippedItemGroup = 0;
let zeroPriceCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = parseCSVLine(line);
  if (parts.length < 13) continue;

  const originalId = parts[0].trim();
  let rawName = parts[1].trim();
  const rawRate = parts[4].trim();
  const rawCatalog = parts[11].trim(); 
  const rawCategory = parts[12].trim(); 
  const itemType = (parts[17] || '').trim(); // Item, ItemGroup, group

  if (rawName.toLowerCase() === 'xxx') continue;

  let rate = parseFloat(rawRate);

  if (itemType.toLowerCase() === 'itemgroup' && (isNaN(rate) || rate === 0)) {
    skippedItemGroup++;
    continue;
  }

  // Formatting name
  let name = rawName
    .replace(/^["']|["']$/g, '')
    .replace(/-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();

  // Clean title case
  name = name.split(' ').map(w => {
    if (w === '-' || w === '/' || w === '&' || w.startsWith('(') || w.endsWith(')')) return w;
    if (/^\d+[a-zA-Z]*$/.test(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');

  let service = 'Dry Clean';
  let serviceKey = 'dry_clean';
  let image = '/images/drycleaning.jpg';

  const cLower = rawCatalog.toLowerCase();
  const catLower = rawCategory.toLowerCase();
  const nLower = rawName.toLowerCase();

  if (cLower.includes('steam') || cLower.includes('iron') || cLower.includes('press')) {
    serviceKey = 'steam_iron';
    service = 'Steam Iron';
    image = '/images/steamiron.jpg';
  } else if (cLower.includes('laundry')) {
    serviceKey = 'wash_fold';
    service = 'Laundry';
    image = '/images/laundry.jpg';
  } else if (cLower.includes('shoe') || catLower.includes('shoe') || nLower.includes('shoe') || nLower.includes('sneaker') || nLower.includes('boot') || nLower.includes('sandel') || nLower.includes('slipper')) {
    serviceKey = 'shoe_care';
    service = 'Shoe Cleaning';
    image = '/images/shoes.jpg';
  } else if (cLower.includes('bag') || catLower.includes('bag') || nLower.includes('bag') || nLower.includes('trolley')) {
    serviceKey = 'bag_care';
    service = 'Bag Cleaning';
    image = '/images/leather.jpg';
  } else if (cLower.includes('access') || catLower.includes('access')) {
    serviceKey = 'accessories';
    service = 'Accessories';
    image = '/images/drycleaning.jpg';
  } else {
    serviceKey = 'dry_clean';
    service = 'Dry Clean';
    image = '/images/drycleaning.jpg';
  }

  // Audience determination
  let audience = 'Household';
  if (catLower.includes('kid') || catLower.includes('child')) audience = 'Kids';
  else if (catLower.includes('women') || catLower.includes('ladies') || catLower.includes('female')) audience = 'Women';
  else if (catLower.includes('men') || catLower.includes('gent')) audience = 'Men';
  else if (catLower.includes('shoe')) audience = 'Footwear';
  else if (catLower.includes('bag')) audience = 'Bags & Luggage';
  else if (catLower.includes('access')) audience = 'Accessories';
  else if (catLower.includes('institution')) audience = 'Institutional';
  else if (catLower.includes('house') || catLower.includes('sofa') || catLower.includes('bed')) audience = 'Household';
  else if (nLower.includes('baby') || nLower.includes('child') || nLower.includes('frock')) audience = 'Kids';
  else if (nLower.includes('ladies') || nLower.includes('saree') || nLower.includes('lehnga') || nLower.includes('lehenga') || nLower.includes('blouse') || nLower.includes('dupatta') || nLower.includes('gown') || nLower.includes('sarara') || nLower.includes('sharara') || nLower.includes('skirt') || nLower.includes('petti coat') || nLower.includes('bra') || nLower.includes('shrug') || nLower.includes('choli') || nLower.includes('rida')) audience = 'Women';
  else if (nLower.includes('sherwani') || nLower.includes('safari') || nLower.includes('achkan') || nLower.includes('dhoti') || nLower.includes('lungi') || nLower.includes('kurta') || nLower.includes('turban') || nLower.includes('tuxedo')) audience = 'Men';
  else if (catLower.includes('upper') || catLower.includes('bottom') || catLower.includes('full body') || catLower.includes('winter')) {
    audience = 'Men';
  }

  // Unit assignment
  let unit = '/ pc';
  if (nLower.includes('per kg') || nLower.includes('/ kg') || serviceKey === 'wash_fold') {
    unit = '/ kg';
  } else if (nLower.includes('pair') || serviceKey === 'shoe_care') {
    unit = '/ pair';
  } else if (nLower.includes('per panel') || nLower.includes('panel')) {
    unit = '/ panel';
  } else if (nLower.includes('suit') || nLower.includes('pcs') || nLower.includes('set') || nLower.includes('pec')) {
    unit = '/ set';
  }

  // Rate fallback if 0
  if (isNaN(rate) || rate <= 0) {
    const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = `${serviceKey}_${norm}`;
    if (fallbackMap[key]) {
      rate = fallbackMap[key];
    } else if (fallbackMap[norm]) {
      rate = fallbackMap[norm];
    } else {
      zeroPriceCount++;
      if (serviceKey === 'steam_iron') rate = 20;
      else if (serviceKey === 'shoe_care') rate = 249;
      else if (serviceKey === 'bag_care') rate = 299;
      else if (serviceKey === 'wash_fold') rate = 80;
      else rate = 119;
    }
  }

  const uniqueKey = `${serviceKey}_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${audience.toLowerCase()}`;
  if (seenKeys.has(uniqueKey)) continue;
  seenKeys.add(uniqueKey);

  items.push({
    id: `mhe_${originalId || items.length + 1}`,
    originalId,
    name,
    service,
    serviceKey,
    category: serviceKey,
    audience,
    price: rate,
    unit,
    tag: `${audience} • ${service}`,
    desc: `${service} for ${name} (${audience}) at Mahe Puducherry Studio`,
    image
  });
}

console.log(`Parsed total items: ${items.length}, skipped parent headers: ${skippedItemGroup}, zero-prices resolved: ${zeroPriceCount}`);

// Write JSON
fs.writeFileSync(path.join(__dirname, 'mahe_prices.json'), JSON.stringify(items, null, 2));

// Write JS export
const jsContent = `export const MAHE_CATALOG = ${JSON.stringify(items, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'maheCatalog.js'), jsContent);
