import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { KOKAPET_CATALOG } from './kokapetCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'narsingi_price_list.csv');
const raw = fs.readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/);

function cleanTitle(s) {
  if (!s) return '';
  return s.trim()
    .replace(/^["']|["']$/g, '')
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
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

// Build fallback lookup from Kokapet (Hyderabad regional catalog)
const fallbackLookup = {};
KOKAPET_CATALOG.forEach(item => {
  const normName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normKey = `${normName}_${item.serviceKey}`;
  if (!fallbackLookup[normKey]) {
    fallbackLookup[normKey] = item.price;
  }
  if (!fallbackLookup[normName]) {
    fallbackLookup[normName] = item.price;
  }
});

const items = [];
const seenIds = new Set();

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = parseCSVLine(line);
  if (parts.length < 13) continue;

  const originalId = parts[0].trim();
  const rawName = parts[1].trim();
  const rawRate = parts[4].trim();
  const rawService = parts[11].trim(); // Catalog Name
  const rawAudience = parts[12].trim(); // Category Name

  let rate = parseFloat(rawRate);

  let service = cleanTitle(rawService);
  let audience = cleanTitle(rawAudience);
  let name = cleanTitle(rawName);

  let serviceKey = 'dry_clean';
  let image = '/images/drycleaning.jpg';

  const sLower = rawService.toLowerCase();
  const aLower = rawAudience.toLowerCase();
  const nLower = rawName.toLowerCase();

  if (sLower.includes('steam') || sLower.includes('iron') || sLower.includes('press')) {
    serviceKey = 'steam_iron';
    service = 'Steam Iron';
    image = '/images/steamiron.jpg';
  } else if (sLower.includes('shoe') || aLower.includes('shoe') || nLower.includes('shoe') || nLower.includes('boots') || nLower.includes('sandels') || nLower.includes('slippers')) {
    serviceKey = 'shoe_care';
    service = 'Shoe Cleaning';
    image = '/images/shoes.jpg';
  } else if (sLower.includes('bag') || aLower.includes('bag') || nLower.includes('trolley') || nLower.includes('trolly') || nLower.includes('handbag') || nLower.includes('bagpack') || nLower.includes('bag pack')) {
    serviceKey = 'bag_care';
    service = 'Bag Cleaning';
    image = '/images/leather.jpg';
  } else if (sLower.includes('laundry')) {
    serviceKey = 'wash_fold';
    service = 'Laundry';
    image = '/images/laundry.jpg';
  } else if (sLower.includes('access')) {
    serviceKey = 'accessories';
    service = 'Accessories';
    image = '/images/drycleaning.jpg';
  }

  // Fallback rate resolution if 0
  if (isNaN(rate) || rate <= 0) {
    const normName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normKey = `${normName}_${serviceKey}`;
    if (fallbackLookup[normKey]) {
      rate = fallbackLookup[normKey];
    } else if (fallbackLookup[normName]) {
      rate = fallbackLookup[normName];
    } else {
      // Sensible standard Hyderabad rates if unmapped
      if (serviceKey === 'steam_iron') rate = 15;
      else if (serviceKey === 'shoe_care') rate = 280;
      else if (serviceKey === 'wash_fold') rate = 80;
      else rate = 149;
    }
  }

  // Audience Refinement
  if (aLower === 'men') audience = 'Men';
  else if (aLower === 'women') audience = 'Women';
  else if (aLower === 'kids') audience = 'Kids';
  else if (aLower.includes('house') || aLower.includes('institutional') || aLower.includes('other')) audience = 'Household';
  else if (nLower.includes('kids') || nLower.includes('child')) audience = 'Kids';
  else if (nLower.includes('women') || nLower.includes('ladies') || nLower.includes('saree') || nLower.includes('lehnga') || nLower.includes('lehenga') || nLower.includes('blouse') || nLower.includes('frock')) audience = 'Women';
  else if (nLower.includes('men') || nLower.includes('gents') || nLower.includes('sherwani') || nLower.includes('achkan')) audience = 'Men';

  let unit = '/ pc';
  if (name.toLowerCase().includes('per kg') || rawName.toLowerCase().includes('per kg') || name.toLowerCase().includes('kg')) {
    unit = '/ kg';
  } else if (name.toLowerCase().includes('pair')) {
    unit = '/ pair';
  } else if (name.toLowerCase().includes('sq.ft') || name.toLowerCase().includes('sqft') || name.toLowerCase().includes('square feet') || name.toLowerCase().includes('sq ft')) {
    unit = '/ sq.ft';
  } else if (name.toLowerCase().includes('suit') || name.toLowerCase().includes('pcs') || name.toLowerCase().includes('set')) {
    unit = '/ set';
  }

  const itemId = `nsg_${originalId}`;
  if (seenIds.has(itemId)) continue;
  seenIds.add(itemId);

  items.push({
    id: itemId,
    originalId,
    name,
    service,
    serviceKey,
    category: serviceKey,
    audience,
    price: rate,
    unit,
    tag: `${audience} • ${service}`,
    desc: `${service} for ${name} (${audience}) at Narsingi Hyderabad Studio`,
    image
  });
}

// Write JSON
fs.writeFileSync(path.join(__dirname, 'narsingi_prices.json'), JSON.stringify(items, null, 2));

// Write JS export
const jsContent = `export const NARSINGI_CATALOG = ${JSON.stringify(items, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'narsingiCatalog.js'), jsContent);

console.log(`Successfully generated ${items.length} items for Narsingi Hyderabad Studio.`);
