import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VAISHALI_CATALOG } from './vaishaliCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'nadiad_price_list.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/);

function cleanTitle(s) {
  if (!s) return '';
  return s.trim()
    .replace(/^["']|["']$/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

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

  if (cLower.includes('steam') || cLower.includes('press') || cLower.includes('iron')) {
    serviceKey = 'steam_iron';
    service = 'Steam Iron';
    image = '/images/steamiron.jpg';
  } else if (cLower.includes('laundry') || cLower.includes('wash')) {
    serviceKey = 'wash_fold';
    service = 'Laundry';
    image = '/images/laundry.jpg';
  } else if (cLower.includes('shoe') || catLower.includes('shoe') || nLower.includes('shoe') || nLower.includes('boots') || nLower.includes('sandels') || nLower.includes('slippers')) {
    serviceKey = 'shoe_care';
    service = 'Shoe Cleaning';
    image = '/images/shoes.jpg';
  } else if (cLower.includes('bag') || catLower.includes('bag') || nLower.includes('trolley') || nLower.includes('bagpack') || nLower.includes('handbag')) {
    serviceKey = 'bag_care';
    service = 'Bag Cleaning';
    image = '/images/leather.jpg';
  } else if (cLower.includes('access')) {
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
  if (catLower === 'men') audience = 'Men';
  else if (catLower === 'women') audience = 'Women';
  else if (catLower === 'kids') audience = 'Kids';
  else if (catLower.includes('shoe')) audience = 'Footwear';
  else if (catLower.includes('bag')) audience = 'Bags & Luggage';
  else if (catLower.includes('access')) audience = 'Accessories';
  else if (catLower.includes('house')) audience = 'Household';
  else if (catLower.includes('institutional')) {
    if (nLower.includes('shirt') || nLower.includes('suit') || nLower.includes('kurta') || nLower.includes('sherwani') || nLower.includes('jacket')) {
      audience = 'Men';
    } else {
      audience = 'Household';
    }
  } else if (nLower.includes('kids') || nLower.includes('child') || nLower.includes('frock')) {
    audience = 'Kids';
  } else if (nLower.includes('ladies') || nLower.includes('saree') || nLower.includes('lehnga') || nLower.includes('lehenga') || nLower.includes('blouse') || nLower.includes('dupatta') || nLower.includes('gown') || nLower.includes('sarara') || nLower.includes('sharara') || nLower.includes('skirt') || nLower.includes('petti coat')) {
    audience = 'Women';
  } else if (nLower.includes('sherwani') || nLower.includes('safari') || nLower.includes('achkan') || nLower.includes('dhoti') || nLower.includes('lungi')) {
    audience = 'Men';
  }

  // Unit assignment
  let unit = '/ pc';
  if (nLower.includes('sq.ft') || nLower.includes('/sq.ft')) {
    unit = '/ sq.ft';
  } else if (nLower.includes('per kg') || nLower.includes('/ kg') || cLower.includes('by weight') || (serviceKey === 'wash_fold' && !nLower.includes('piece') && !nLower.includes('towel') && !nLower.includes('garment') && !nLower.includes('inner') && !nLower.includes('shoe'))) {
    unit = '/ kg';
  } else if (nLower.includes('pair')) {
    unit = '/ pair';
  } else if (nLower.includes('per panel') || nLower.includes('panel') || nLower.includes('seater')) {
    unit = nLower.includes('seater') ? '/ seat' : '/ panel';
  } else if (nLower.includes('suit') || nLower.includes('pcs') || nLower.includes('set')) {
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
      else if (serviceKey === 'bag_care') rate = 349;
      else if (serviceKey === 'wash_fold') rate = 80;
      else rate = 119;
    }
  }

  const uniqueKey = `${serviceKey}_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${audience.toLowerCase()}`;
  if (seenKeys.has(uniqueKey)) continue;
  seenKeys.add(uniqueKey);

  items.push({
    id: `nad_${originalId || items.length + 1}`,
    originalId,
    name,
    service,
    serviceKey,
    category: serviceKey,
    audience,
    price: rate,
    unit,
    tag: `${audience} • ${service}`,
    desc: `${service} for ${name} (${audience}) at Nadiad Gujarat Studio`,
    image
  });
}

console.log(`Parsed total items: ${items.length}, skipped parent headers: ${skippedItemGroup}, zero-prices fixed: ${zeroPriceCount}`);

// Write JSON
fs.writeFileSync(path.join(__dirname, 'nadiad_prices.json'), JSON.stringify(items, null, 2));

// Write JS export
const jsContent = `export const NADIAD_CATALOG = ${JSON.stringify(items, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'nadiadCatalog.js'), jsContent);
