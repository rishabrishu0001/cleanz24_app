import { KOKAPET_CATALOG } from '../data/kokapetCatalog.js';
import { SIWARA_CATALOG } from '../data/siwaraCatalog.js';
import { VAISHALI_CATALOG } from '../data/vaishaliCatalog.js';
import { KOWKOOR_CATALOG } from '../data/kowkoorCatalog.js';
import { KAZHAKOOTAM_CATALOG } from '../data/kazhakootamCatalog.js';
import { BRAHMAPUR_CATALOG } from '../data/brahmapurCatalog.js';
import { JEYPORE_CATALOG } from '../data/jeyporeCatalog.js';
import { NOIDA41_CATALOG } from '../data/noida41Catalog.js';
import { BHILWARA_CATALOG } from '../data/bhilwaraCatalog.js';
import { KONDAPUR_CATALOG } from '../data/kondapurCatalog.js';
import { NOIDA137_CATALOG } from '../data/noida137Catalog.js';
import { OLDTOWN_CATALOG } from '../data/oldtownCatalog.js';
import { GOPANPALLY_CATALOG } from '../data/gopanpallyCatalog.js';
import { BHOPAL_CATALOG } from '../data/bhopalCatalog.js';
import { BEERAMGUDA_CATALOG } from '../data/beeramgudaCatalog.js';
import { GACHIBOWLI_CATALOG } from '../data/gachibowliCatalog.js';
import { ALIBAG_CATALOG } from '../data/alibagCatalog.js';
import { CUTTACK_CATALOG } from '../data/cuttackCatalog.js';
import { SANCHORE_CATALOG } from '../data/sanchoreCatalog.js';
import { NARSINGI_CATALOG } from '../data/narsingiCatalog.js';
import { ROORKEE_CATALOG } from '../data/roorkeeCatalog.js';
import { THAMPANOOR_CATALOG } from '../data/thampanoorCatalog.js';
import { THANE_CATALOG } from '../data/thaneCatalog.js';
import { NIRALA_ESTATE_CATALOG } from '../data/niralaEstateCatalog.js';
import { AMRITSAR_CATALOG } from '../data/amritsarCatalog.js';
import { JATNI_CATALOG } from '../data/jatniCatalog.js';
import { IBNAGAR_CATALOG } from '../data/ibnagarCatalog.js';
import { PURNIA_CATALOG } from '../data/purniaCatalog.js';
import { NADIAD_CATALOG } from '../data/nadiadCatalog.js';
import { SILIGURI_CATALOG } from '../data/siliguriCatalog.js';
import { KHARAR_CATALOG } from '../data/khararCatalog.js';
import { ANGUL_CATALOG } from '../data/angulCatalog.js';
import { PARAD_CATALOG } from '../data/paradCatalog.js';
import { PALASUNI_CATALOG } from '../data/palasuniCatalog.js';
import { UDAIPUR_CATALOG } from '../data/udaipurCatalog.js';
import { MAHE_CATALOG } from '../data/maheCatalog.js';
import { PATIALA_CATALOG } from '../data/patialaCatalog.js';
import defaultStores from '../data/stores.json';

export function getRealCatalogForStore(store) {
  if (!store) return NOIDA41_CATALOG;

  // 1. If store already has a populated custom price list from Atlas
  if (Array.isArray(store.priceList) && store.priceList.length > 0) {
    return store.priceList;
  }

  // 2. Resolve by exact store identity / location
  const str = `${store.name || ''} ${store.address || ''} ${store.city || ''} ${store.state || ''}`.toLowerCase();

  if (str.includes('sector 137') || str.includes('137 noida')) return NOIDA137_CATALOG;
  if (str.includes('sector 41') || (str.includes('noida') && !str.includes('extension') && !str.includes('greater noida'))) return NOIDA41_CATALOG;
  if (str.includes('nirala') || str.includes('patwari') || str.includes('swarn nagari') || str.includes('greater noida') || str.includes('tech zone')) return NIRALA_ESTATE_CATALOG;
  if (str.includes('vaishali') || str.includes('indirapuram') || str.includes('ghaziabad')) return VAISHALI_CATALOG;
  if (str.includes('jeypore') || str.includes('koraput')) return JEYPORE_CATALOG;
  if (str.includes('old town') || str.includes('kharakhia')) return OLDTOWN_CATALOG;
  if (str.includes('brahm') || str.includes('berhampur')) return BRAHMAPUR_CATALOG;
  if (str.includes('jatni') || str.includes('khordha')) return JATNI_CATALOG;
  if (str.includes('cuttack') || str.includes('markat nagar') || str.includes('cda')) return CUTTACK_CATALOG;
  if (str.includes('thampanoor') || str.includes('thyvila')) return THAMPANOOR_CATALOG;
  if (str.includes('kazhak') || str.includes('trivandrum')) return KAZHAKOOTAM_CATALOG;
  if (str.includes('ib nagar') || str.includes('vanasthalipuram')) return IBNAGAR_CATALOG;
  if (str.includes('kowkoor') || str.includes('alwal')) return KOWKOOR_CATALOG;
  if (str.includes('kondapur')) return KONDAPUR_CATALOG;
  if (str.includes('gopanpally') || str.includes('tellapur')) return GOPANPALLY_CATALOG;
  if (str.includes('kokapet')) return KOKAPET_CATALOG;
  if (str.includes('narsingi')) return NARSINGI_CATALOG;
  if (str.includes('roorkee') || str.includes('haridwar') || str.includes('chamoli') || str.includes('karnaprayag')) return ROORKEE_CATALOG;
  if (str.includes('purnia')) return PURNIA_CATALOG;
  if (str.includes('bhilwara')) return BHILWARA_CATALOG;
  if (str.includes('siwara')) return SIWARA_CATALOG;
  if (str.includes('sanchore') || str.includes('jalore')) return SANCHORE_CATALOG;
  if (str.includes('udaipur')) return UDAIPUR_CATALOG;
  if (str.includes('bhopal') || str.includes('madhya pradesh')) return BHOPAL_CATALOG;
  if (str.includes('beeramguda') || str.includes('sangareddy')) return BEERAMGUDA_CATALOG;
  if (str.includes('gachibowli')) return GACHIBOWLI_CATALOG;
  if (str.includes('alibag') || str.includes('raigad')) return ALIBAG_CATALOG;
  if (str.includes('thane') || str.includes('mumbai') || str.includes('maharashtra')) return THANE_CATALOG;
  if (str.includes('amritsar') || str.includes('bathinda') || str.includes('punjab')) return AMRITSAR_CATALOG;
  if (str.includes('patiala')) return PATIALA_CATALOG;
  if (str.includes('kharar') || str.includes('panchkula') || str.includes('chandigarh')) return KHARAR_CATALOG;
  if (str.includes('nadiad') || str.includes('gujarat')) return NADIAD_CATALOG;
  if (str.includes('siliguri') || str.includes('bengal')) return SILIGURI_CATALOG;
  if (str.includes('parad')) return PARAD_CATALOG;
  if (str.includes('mahe')) return MAHE_CATALOG;
  if (str.includes('angul')) return ANGUL_CATALOG;
  if (str.includes('palasuni') || str.includes('bhubaneswar') || str.includes('odisha')) return PALASUNI_CATALOG;
  if (str.includes('kerala')) return KAZHAKOOTAM_CATALOG;
  if (str.includes('telangana') || str.includes('hyderabad')) return KOWKOOR_CATALOG;


  return VAISHALI_CATALOG;
}

// ─── Haversine distance in km ────────────────────────────────────────────────
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Map a store to its studioKey in ServicesScreen ─────────────────────────
export function getStudioKeyForStore(store) {
  if (!store) return 'noida41';
  const str = `${store.name || ''} ${store.address || ''} ${store.city || ''} ${store.state || ''}`.toLowerCase();

  if (str.includes('sector 137') || str.includes('137 noida')) return 'noida137';
  if (str.includes('sector 41') || (str.includes('noida') && !str.includes('extension') && !str.includes('greater noida'))) return 'noida41';
  if (str.includes('nirala') || str.includes('patwari') || str.includes('swarn nagari') || str.includes('greater noida') || str.includes('tech zone')) return 'niralaestate';
  if (str.includes('vaishali') || str.includes('indirapuram') || str.includes('ghaziabad')) return 'vaishali';
  if (str.includes('gachibowli')) return 'gachibowli';
  if (str.includes('gopanpally') || str.includes('tellapur')) return 'gopanpally';
  if (str.includes('kokapet')) return 'kokapet';
  if (str.includes('narsingi')) return 'narsingi';
  if (str.includes('kondapur')) return 'kondapur';
  if (str.includes('beeramguda') || str.includes('sangareddy')) return 'beeramguda';
  if (str.includes('kowkoor') || str.includes('alwal')) return 'kowkoor';
  if (str.includes('ib nagar') || str.includes('vanasthalipuram')) return 'ibnagar';
  if (str.includes('roorkee') || str.includes('haridwar') || str.includes('chamoli') || str.includes('karnaprayag')) return 'roorkee';
  if (str.includes('sanchore') || str.includes('jalore')) return 'sanchore';
  if (str.includes('bhilwara')) return 'bhilwara';
  if (str.includes('siwara')) return 'siwara';
  if (str.includes('udaipur')) return 'udaipur';
  if (str.includes('bhopal') || str.includes('madhya pradesh')) return 'bhopal';
  if (str.includes('alibag') || str.includes('raigad')) return 'alibag';
  if (str.includes('thane') || str.includes('mumbai') || str.includes('maharashtra')) return 'thane';
  if (str.includes('amritsar') || str.includes('bathinda') || str.includes('punjab')) return 'amritsar';
  if (str.includes('patiala')) return 'patiala';
  if (str.includes('kharar') || str.includes('panchkula') || str.includes('chandigarh')) return 'kharar';
  if (str.includes('nadiad') || str.includes('gujarat')) return 'nadiad';
  if (str.includes('siliguri') || str.includes('bengal')) return 'siliguri';
  if (str.includes('cuttack') || str.includes('markat nagar')) return 'cuttack';
  if (str.includes('old town') || str.includes('kharakhia')) return 'oldtown';
  if (str.includes('brahm') || str.includes('berhampur')) return 'brahmapur';
  if (str.includes('jeypore') || str.includes('koraput')) return 'jeypore';
  if (str.includes('jatni') || str.includes('khordha')) return 'jatni';
  if (str.includes('angul')) return 'angul';
  if (str.includes('palasuni') || str.includes('bhubaneswar') || str.includes('odisha')) return 'palasuni';
  if (str.includes('thampanoor') || str.includes('thyvila')) return 'thampanoor';
  if (str.includes('kazhak') || str.includes('trivandrum')) return 'kazhakootam';
  if (str.includes('parad')) return 'parad';
  if (str.includes('mahe')) return 'mahe';
  if (str.includes('purnia')) return 'purnia';

  return 'noida41';
}

// ─── Resolve nearest store based on GPS coordinates or address text ────────
export function findNearestStore(coords, locationText = '', storesList = null) {
  // If storesList not provided, use defaultStores from stores.json
  const stores = (storesList && storesList.length > 0) ? storesList : defaultStores;

  // 1. Coordinates matching
  if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number' && !isNaN(coords.lat) && !isNaN(coords.lng) && stores.length > 0) {
    let nearest = null;
    let minDistance = Infinity;

    for (const s of stores) {
      if (typeof s.lat === 'number' && typeof s.lng === 'number') {
        const dist = getDistance(coords.lat, coords.lng, s.lat, s.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = s;
        }
      }
    }

    if (nearest) {
      return {
        store: nearest,
        studioKey: getStudioKeyForStore(nearest),
        distanceKm: minDistance
      };
    }
  }

  // 2. Keyword text matching
  if (locationText && typeof locationText === 'string' && stores.length > 0) {
    const q = locationText.toLowerCase();
    
    // Direct matches for prominent areas
    if (q.includes('137') || q.includes('sector 137')) {
      const s137 = stores.find(s => s.name?.includes('137'));
      if (s137) return { store: s137, studioKey: 'noida137', distanceKm: null };
    }
    if (q.includes('noida') || q.includes('sector 41') || q.includes('sector 94')) {
      const s41 = stores.find(s => s.name?.includes('41')) || stores[0];
      return { store: s41, studioKey: 'noida41', distanceKm: null };
    }
    if (q.includes('nirala') || q.includes('greater noida') || q.includes('patwari')) {
      const snir = stores.find(s => s.name?.toLowerCase().includes('nirala'));
      if (snir) return { store: snir, studioKey: 'niralaestate', distanceKm: null };
    }
    if (q.includes('vaishali') || q.includes('indirapuram') || q.includes('ghaziabad')) {
      const svai = stores.find(s => s.name?.toLowerCase().includes('vaishali') || s.name?.toLowerCase().includes('indirapuram'));
      if (svai) return { store: svai, studioKey: 'vaishali', distanceKm: null };
    }
    if (q.includes('gachibowli')) {
      const sgac = stores.find(s => s.name?.toLowerCase().includes('gachibowli'));
      if (sgac) return { store: sgac, studioKey: 'gachibowli', distanceKm: null };
    }
    if (q.includes('kondapur')) {
      const skon = stores.find(s => s.name?.toLowerCase().includes('kondapur'));
      if (skon) return { store: skon, studioKey: 'kondapur', distanceKm: null };
    }
    if (q.includes('hyderabad') || q.includes('secunderabad')) {
      const shyd = stores.find(s => s.city?.toLowerCase().includes('hyderabad'));
      if (shyd) return { store: shyd, studioKey: getStudioKeyForStore(shyd), distanceKm: null };
    }
    if (q.includes('thane') || q.includes('mumbai')) {
      const sthn = stores.find(s => s.name?.toLowerCase().includes('thane'));
      if (sthn) return { store: sthn, studioKey: 'thane', distanceKm: null };
    }
    if (q.includes('udaipur')) {
      const suda = stores.find(s => s.name?.toLowerCase().includes('udaipur'));
      if (suda) return { store: suda, studioKey: 'udaipur', distanceKm: null };
    }
    if (q.includes('amritsar') || q.includes('punjab')) {
      const samr = stores.find(s => s.name?.toLowerCase().includes('amritsar'));
      if (samr) return { store: samr, studioKey: 'amritsar', distanceKm: null };
    }

    const matched = stores.find(s => {
      const fullText = `${s.name} ${s.city} ${s.state} ${s.address} ${(s.tags || []).join(' ')}`.toLowerCase();
      const words = q.split(/[\s,]+/).filter(w => w.length >= 4);
      return words.some(w => fullText.includes(w));
    });

    if (matched) {
      return {
        store: matched,
        studioKey: getStudioKeyForStore(matched),
        distanceKm: null
      };
    }
  }

  // 3. Fallback default
  const defaultStore = stores[0] || { id: 1, name: 'Cleanz24 - Sector 41 Noida', city: 'Noida', state: 'Uttar Pradesh' };
  return {
    store: defaultStore,
    studioKey: getStudioKeyForStore(defaultStore),
    distanceKm: null
  };
}
