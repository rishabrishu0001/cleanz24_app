import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, MapPin, Phone, MessageCircle, Star, ChevronRight,
  X, Navigation, Loader, AlertCircle, Store, Map, ArrowRight
} from 'lucide-react';
import storesData from '../data/stores.json';
import api from '../services/api.js';
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

// ─── Haversine distance formula (returns km) ──────────────────────────────
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function ratingColor(r) {
  if (r >= 4.8) return 'var(--accent-emerald)';
  if (r >= 4.6) return 'var(--primary-green)';
  return 'var(--accent-amber)';
}

function StarRating({ rating }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? '#F59E0B' : 'var(--text-subtle)', fontSize: '11px' }}>★</span>
      ))}
    </span>
  );
}

// ─── Pulsing location dot animation ───────────────────────────────────────
const pulseStyle = `
  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const NEARBY_KM = 20;
const ALL_STATES_OPTION = 'All States';
const ALL_STATES = [ALL_STATES_OPTION, ...Array.from(new Set(storesData.map(s => s.state))).sort()];

function getStoreCatalog(store) {
  if (!store) return { name: 'Sector 41, Noida Studio', stateLabel: 'Uttar Pradesh', items: NOIDA41_CATALOG, shortName: 'Noida Sec 41', preview: 'Wash & Fold: ₹80/kg · Wash & Steam Iron: ₹110/kg · Suit 3 Pcs: ₹499 · Saree: ₹199 · Leather Jacket: ₹700' };

  // If store has custom price list configured in MongoDB Atlas / Admin Panel
  if (Array.isArray(store.priceList) && store.priceList.length > 0) {
    const previewList = store.priceList.slice(0, 4).map(it => `${it.name}: ₹${it.price}${it.unit ? it.unit : ''}`).join(' · ');
    return {
      name: store.name,
      stateLabel: store.state || store.city || 'Studio',
      items: store.priceList,
      shortName: store.name,
      preview: previewList || 'Custom Franchise Store Price List'
    };
  }

  const str = `${store.name || ''} ${store.address || ''} ${store.city || ''} ${store.state || ''}`.toLowerCase();
  if (str.includes('sector 137') || str.includes('137 noida')) {
    return { name: 'Cleanz24 - Sector 137 Noida', stateLabel: 'Uttar Pradesh', items: NOIDA137_CATALOG, shortName: 'Noida Sec 137', preview: 'Wash & Fold: ₹90/kg · Wash & Steam Iron: ₹120/kg · Suit 3 Pcs: ₹500 · Saree: ₹250 · Blanket: ₹350' };
  }
  if (str.includes('sector 41') || (str.includes('noida') && !str.includes('extension') && !str.includes('greater noida') && !str.includes('sector 137'))) {
    return { name: 'Cleanz24 - Sector 41 Noida', stateLabel: 'Uttar Pradesh', items: NOIDA41_CATALOG, shortName: 'Noida Sec 41', preview: 'Wash & Fold: ₹80/kg · Wash & Steam Iron: ₹110/kg · Suit 3 Pcs: ₹499 · Saree: ₹199 · Leather Jacket: ₹700' };
  }
  if (str.includes('jeypore') || str.includes('jeypoor') || str.includes('koraput')) {
    return { name: 'Cleanz24 - Jeypore', stateLabel: 'Odisha', items: JEYPORE_CATALOG, shortName: 'Jeypore', preview: 'Wash & Fold: ₹70/kg · Wash & Steam Iron: ₹100/kg · Double Blanket: ₹150 · Suit: ₹289 · Saree: ₹149' };
  }
  if (str.includes('old town') || str.includes('kharakhia') || (str.includes('bhubaneswar') && str.includes('old'))) {
    return { name: 'Cleanz24 - Old Town Bhubaneswar', stateLabel: 'Odisha', items: OLDTOWN_CATALOG, shortName: 'Old Town Bhubaneswar', preview: 'Wash & Fold: ₹75/kg · Wash & Steam Iron: ₹100/kg · Suit 3 Pcs: ₹379 · Saree: ₹149 · Blanket: ₹299' };
  }
  if (str.includes('brahm') || str.includes('berhampur')) {
    return { name: 'Cleanz24 - Brahmapur (Berhampur)', stateLabel: 'Odisha', items: BRAHMAPUR_CATALOG, shortName: 'Brahmapur', preview: 'Wash & Fold: ₹70/kg · Wash & Steam Iron: ₹100/kg · Suit 3 Pcs: ₹349 · Saree: ₹150 · Blanket: ₹230' };
  }
  if (str.includes('jatni') || str.includes('khordha') || str.includes('somanath')) {
    return { name: 'Cleanz24 - Jatni Khordha', stateLabel: 'Odisha', items: JATNI_CATALOG, shortName: 'Jatni', preview: 'Wash & Fold: ₹70/kg · Wash & Iron: ₹100/kg · Suit 2 Pcs: ₹289 · Saree: ₹149 · Blanket: ₹299–₹399' };
  }
  if (str.includes('cuttack') || str.includes('markat nagar') || str.includes('cda')) {
    return { name: 'Cleanz24 - CDA Cuttack', stateLabel: 'Odisha', items: CUTTACK_CATALOG, shortName: 'CDA Cuttack', preview: 'Wash & Fold: ₹70/kg · Wash & Iron: ₹100/kg · Suit 3 Pcs: ₹369 · Saree: ₹199 · Shoes: ₹249' };
  }
  if (str.includes('thampanoor') || str.includes('thyvila')) {
    return { name: 'Cleanz24 - Thampanoor Trivandrum', stateLabel: 'Kerala', items: THAMPANOOR_CATALOG, shortName: 'Thampanoor', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Kerala Saree: ₹149 · Suit Set: ₹498 · Kancheepuram Silk: ₹449' };
  }
  if (str.includes('kazhak') || str.includes('thiruvananthapuram') || str.includes('trivandrum')) {
    return { name: 'Cleanz24 - Kazhakkoottam Trivandrum', stateLabel: 'Kerala', items: KAZHAKOOTAM_CATALOG, shortName: 'Kazhakootam', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Kerala Saree: ₹149 · Kancheepuram Silk: ₹449 · Suit: ₹498' };
  }
  if (str.includes('ib nagar') || str.includes('vanasthalipuram') || str.includes('seshadri') || str.includes('prashanth nagar')) {
    return { name: 'Cleanz24 - Vanasthalipuram IB Nagar Hyderabad', stateLabel: 'Telangana', items: IBNAGAR_CATALOG, shortName: 'IB Nagar (Vanasthalipuram)', preview: 'Wash & Fold: ₹100/kg · Wash & Iron: ₹130/kg · Lehenga: ₹350–₹900 · Kurta Starch: ₹80 · Shoe Cleaning: ₹350' };
  }
  if (str.includes('kowkoor') || str.includes('alwal')) {
    return { name: 'Cleanz24 - Kowkoor Secunderabad', stateLabel: 'Telangana', items: KOWKOOR_CATALOG, shortName: 'Kowkoor', preview: 'Wash & Fold: ₹85/kg · Wash & Iron: ₹130/kg · Suit 3 Pcs: ₹459 · Curtains: ₹269 · Silk Saree: ₹249' };
  }
  if (str.includes('kondapur')) {
    return { name: 'Cleanz24 - Kondapur Hyderabad', stateLabel: 'Telangana', items: KONDAPUR_CATALOG, shortName: 'Kondapur', preview: 'Wash & Fold: ₹100/kg · Wash & Iron: ₹130/kg · Hygiene Laundry: ₹150 · Saree Silk: ₹279 · Leather Jacket: ₹599' };
  }
  if (str.includes('gopanpally') || str.includes('gopanpalle') || str.includes('tellapur')) {
    return { name: 'Cleanz24 - Gopanpally Tellapur Hyderabad', stateLabel: 'Telangana', items: GOPANPALLY_CATALOG, shortName: 'Gopanpally', preview: 'Wash & Fold: ₹100/kg · Wash & Iron: ₹130/kg · Hygiene Laundry: ₹150 · Suit 3 Pcs: ₹499 · Saree: ₹199' };
  }
  if (str.includes('kokapet')) {
    return { name: 'Cleanz24 - Kokapet, Hyderabad', stateLabel: 'Telangana', items: KOKAPET_CATALOG, shortName: 'Kokapet', preview: 'Wash & Fold: ₹100/kg · Wash & Iron: ₹130/kg · Curtains: ₹289 · Saree: ₹199 · Baniean: ₹15' };
  }
  if (str.includes('narsingi') || str.includes('skyrena')) {
    return { name: 'Cleanz24 - Narsingi Hyderabad', stateLabel: 'Telangana', items: NARSINGI_CATALOG, shortName: 'Narsingi', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹120/kg · Shirts: ₹15 · Bedsheet: ₹120–₹160 · Shoes: ₹280–₹400' };
  }
  if (str.includes('roorkee') || str.includes('haridwar') || str.includes('bhandari')) {
    return { name: 'Cleanz24 - Roorkee', stateLabel: 'Uttarakhand', items: ROORKEE_CATALOG, shortName: 'Roorkee', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Premium Laundry: ₹169 · Quilt: ₹199 · Saree: ₹199 · Blazer: ₹299' };
  }
  if (str.includes('purnia') || str.includes('khazanchi') || str.includes('khiru')) {
    return { name: 'Cleanz24 - Purnia', stateLabel: 'Bihar', items: PURNIA_CATALOG, shortName: 'Purnia', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Premium Laundry: ₹149 · Suit 2 Pcs: ₹249 · Saree: ₹129–₹299' };
  }
  if (str.includes('nirala') || str.includes('patwari') || str.includes('tech zone')) {
    return { name: 'Cleanz24 - Nirala Estate Greater Noida West', stateLabel: 'Uttar Pradesh', items: NIRALA_ESTATE_CATALOG, shortName: 'Nirala Estate', preview: 'Wash & Fold: ₹80/kg · Wash & Steam Iron: ₹110/kg · Premium Laundry: ₹169/kg · Suit: ₹379 · Saree: ₹199' };
  }
  if (str.includes('vaishali') || str.includes('ghaziabad')) {
    return { name: 'Cleanz24 - Vaishali Ghaziabad', stateLabel: 'Uttar Pradesh', items: VAISHALI_CATALOG, shortName: 'Vaishali', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Shirt Full Charak: ₹189 · Suit 3 Pcs: ₹499 · Quilt: ₹349' };
  }
  if (str.includes('bhilwara') || str.includes('bhilwada') || str.includes('sindhu nagar')) {
    return { name: 'Cleanz24 - Bhilwara', stateLabel: 'Rajasthan', items: BHILWARA_CATALOG, shortName: 'Bhilwara', preview: 'Wash & Fold: ₹70/kg · Wash & Steam Iron: ₹100/kg · Suit 3 Pcs: ₹329 · Rajputi Poshak: ₹499 · Blanket: ₹249' };
  }
  if (str.includes('siwara')) {
    return { name: 'Cleanz24 - Main Market Siwara', stateLabel: 'Rajasthan', items: SIWARA_CATALOG, shortName: 'Siwara', preview: 'Wash & Fold: ₹70/kg · Wash & Iron: ₹100/kg · Saree: ₹199 · Shirt Dry Clean: ₹80' };
  }
  if (str.includes('sanchore') || str.includes('jalore') || str.includes('raniwara')) {
    return { name: 'Cleanz24 - Sanchore', stateLabel: 'Rajasthan', items: SANCHORE_CATALOG, shortName: 'Sanchore', preview: 'Wash & Fold: ₹70/kg · Wash & Iron: ₹100/kg · Suit 3 Pcs: ₹379 · Saree: ₹199 · Blanket: ₹199–₹299' };
  }
  if (str.includes('udaipur') || str.includes('panchwati') || str.includes('alok school') || str.includes('rk mall')) {
    return { name: 'Cleanz24 - Udaipur', stateLabel: 'Rajasthan', items: UDAIPUR_CATALOG, shortName: 'Udaipur', preview: 'Wash & Fold: ₹70/kg · Wash & Iron: ₹100/kg · Premium Laundry: ₹170/kg · Poshak: ₹399–₹599 · Saree: ₹60–₹100 (Steam)' };
  }
  if (str.includes('bhopal') || str.includes('bagmugaliya') || str.includes('madhya pradesh')) {
    return { name: 'Cleanz24 - Bhopal', stateLabel: 'Madhya Pradesh', items: BHOPAL_CATALOG, shortName: 'Bhopal', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹379 · Saree: ₹199 · Blanket: ₹299' };
  }
  if (str.includes('beeramguda') || str.includes('sangareddy')) {
    return { name: 'Cleanz24 - Beeramguda Sangareddy', stateLabel: 'Telangana', items: BEERAMGUDA_CATALOG, shortName: 'Beeramguda', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹459-₹499 · Saree: ₹199 · Blanket: ₹349-₹599' };
  }
  if (str.includes('gachibowli') || str.includes('janardhan reddy')) {
    return { name: 'Cleanz24 - Gachibowli Hyderabad', stateLabel: 'Telangana', items: GACHIBOWLI_CATALOG, shortName: 'Gachibowli', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹499 · Saree: ₹199 · Shoes: ₹399' };
  }
  if (str.includes('alibag') || str.includes('alibaugh') || str.includes('raigad')) {
    return { name: 'Cleanz24 - Alibag', stateLabel: 'Maharashtra', items: ALIBAG_CATALOG, shortName: 'Alibag', preview: 'Wash & Fold: ₹120/kg · Wash & Iron: ₹140/kg · Suit 3 Pcs: ₹399 · Saree: ₹189–₹329 · Blanket: ₹299–₹399' };
  }
  if (str.includes('thane') || str.includes('ghodbunder') || str.includes('palacia')) {
    return { name: 'Cleanz24 - Thane West', stateLabel: 'Maharashtra', items: THANE_CATALOG, shortName: 'Thane West', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Premium Laundry: ₹170/kg · Suit 2 Pcs: ₹399 · Saree: ₹199' };
  }
  if (str.includes('amritsar') || str.includes('sultanwind') || str.includes('sultan wind') || str.includes('kot bhagat singh')) {
    return { name: 'Cleanz24 - Amritsar', stateLabel: 'Punjab', items: AMRITSAR_CATALOG, shortName: 'Amritsar', preview: 'Wash & Fold: ₹88/kg · Wash & Steam Iron: ₹121/kg · Turban: ₹58 · Kurta Pyjama: ₹198 · Suit 3 Pcs: ₹499' };
  }
  if (str.includes('nadiad') || str.includes('gujarat')) {
    return { name: 'Cleanz24 - Nadiad', stateLabel: 'Gujarat', items: NADIAD_CATALOG, shortName: 'Nadiad', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹199 · Saree: ₹149 · Blanket: ₹299–₹399' };
  }
  if (str.includes('siliguri') || str.includes('bengal') || str.includes('ashram para') || str.includes('hakim para')) {
    return { name: 'Cleanz24 - Siliguri', stateLabel: 'West Bengal', items: SILIGURI_CATALOG, shortName: 'Siliguri', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹329 · Saree: ₹129–₹299 · Blanket: ₹249–₹399' };
  }
  if (str.includes('kharar') || str.includes('sbp') || str.includes('sector 127')) {
    return { name: 'Cleanz24 - Kharar', stateLabel: 'Punjab', items: KHARAR_CATALOG, shortName: 'Kharar', preview: 'Wash & Fold: ₹80/kg (₹20/pc) · Wash & Steam Iron: ₹110/kg · Suit 3 Pcs: ₹400 · Saree: ₹199 · Turban: ₹49' };
  }
  if (str.includes('patiala') || str.includes('urban estate') || str.includes('sco 258') || str.includes('147002')) {
    return { name: 'Cleanz24 - Patiala', stateLabel: 'Punjab', items: PATIALA_CATALOG, shortName: 'Patiala', preview: 'Wash & Fold: ₹80/kg · Wash & Steam Iron: ₹110/kg · Premium: ₹169/kg · Suit 3 Pcs: ₹149 (Steam) / ₹499 (DC) · Saree: ₹100–₹175 (Steam) / ₹199–₹479 (DC)' };
  }
  if (str.includes('punjab') || str.includes('bathinda')) {
    return { name: store.name, stateLabel: 'Punjab', items: AMRITSAR_CATALOG, shortName: store.city || 'Punjab', preview: 'Wash & Fold: ₹88/kg · Wash & Steam Iron: ₹121/kg · Turban: ₹58 · Kurta Pyjama: ₹198 · Suit 3 Pcs: ₹499' };
  }
  if (str.includes('parad') || str.includes('parat') || str.includes('kunnothuparamba')) {
    return { name: 'Cleanz24 - Parad Parat', stateLabel: 'Kerala', items: PARAD_CATALOG, shortName: 'Parad', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹90 (Steam) / ₹389 (DC) · Saree: ₹50–₹150 (Steam) / ₹249–₹479 (DC)' };
  }
  if (str.includes('mahe') || str.includes('poozhithala') || str.includes('paickat') || str.includes('puducherry') || str.includes('pondicherry')) {
    return { name: 'Cleanz24 - Mahe Puducherry', stateLabel: 'Puducherry', items: MAHE_CATALOG, shortName: 'Mahe', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹90 (Steam) / ₹389 (DC) · Saree: ₹50–₹150 (Steam) / ₹249–₹479 (DC)' };
  }
  if (str.includes('kerala')) {
    return { name: store.name, stateLabel: 'Kerala', items: KAZHAKOOTAM_CATALOG, shortName: 'Kazhakootam', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Kerala Saree: ₹149 · Kancheepuram Silk: ₹449 · Suit: ₹498' };
  }
  if (str.includes('hyderabad') || str.includes('secunderabad') || str.includes('telangana')) {
    return { name: store.name, stateLabel: 'Telangana', items: KOWKOOR_CATALOG, shortName: 'Kowkoor', preview: 'Wash & Fold: ₹85/kg · Wash & Iron: ₹130/kg · Suit 3 Pcs: ₹459 · Curtains: ₹269 · Silk Saree: ₹249' };
  }
  if (str.includes('angul') || str.includes('amalapada') || str.includes('gandhimarg')) {
    return { name: 'Cleanz24 - Angul', stateLabel: 'Odisha', items: ANGUL_CATALOG, shortName: 'Angul', preview: 'Wash & Fold: ₹80/kg · Wash & Iron: ₹110/kg · Suit 3 Pcs: ₹90 (Steam) · Saree: ₹149–₹249 · Blanket: ₹199–₹399' };
  }
  if (str.includes('palasuni') || str.includes('satya vihar') || str.includes('rasulgarh')) {
    return { name: 'Cleanz24 - Palasuni Bhubaneswar', stateLabel: 'Odisha', items: PALASUNI_CATALOG, shortName: 'Palasuni', preview: 'Wash & Fold: ₹80/kg (₹20/pc) · Wash & Iron: ₹110/kg (₹30/pc) · Suit 3 Pcs: ₹90 (Steam) / ₹379 (DC) · Saree: ₹50–₹150 (Steam) / ₹199–₹350 (DC)' };
  }
  if (str.includes('odisha')) {
    return { name: store.name, stateLabel: 'Odisha', items: BRAHMAPUR_CATALOG, shortName: 'Brahmapur', preview: 'Wash & Fold: ₹70/kg · Wash & Steam Iron: ₹100/kg · Suit 3 Pcs: ₹349 · Saree: ₹150 · Blanket: ₹230' };
  }
  return { name: store.name, stateLabel: store.state || 'Studio', items: VAISHALI_CATALOG, shortName: store.city || 'Studio', preview: 'Steam Iron, German Eco Dry Clean, Wash & Fold, Shoe & Bag Spa' };
}

export default function StoresScreen({ 
  onStartBooking, 
  onLocationDetected,
  userCoords: appCoords,
  setUserCoords: setAppCoords,
  userLocation: appLocation,
  onOpenLocationPicker
}) {
  const [locationState, setLocationState] = useState(appCoords ? 'nearby' : 'idle'); // idle | loading | nearby | none_nearby | browse | denied
  const [internalCoords, setInternalCoords] = useState(appCoords || null);   // { lat, lng }
  const [geoError, setGeoError] = useState('');

  // Sync with external coordinates if changed via LocationPickerModal
  useEffect(() => {
    if (appCoords) {
      setInternalCoords(appCoords);
      setLocationState('nearby');
    }
  }, [appCoords]);

  const userCoords = appCoords || internalCoords;

  // Live stores state (MongoDB Atlas synced)
  const [stores, setStores] = useState(storesData);

  useEffect(() => {
    api.stores.getAll()
      .then(res => {
        if (res.stores && res.stores.length > 0) {
          setStores(res.stores);
        }
      })
      .catch(err => console.log('Using static storesData:', err.message));
  }, []);

  // browse-mode filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(ALL_STATES_OPTION);
  const [expandedStore, setExpandedStore] = useState(null);

  // Store Price List Modal State
  const [priceListModalStore, setPriceListModalStore] = useState(null);
  const [modalSearch, setModalSearch] = useState('');
  const [modalCategory, setModalCategory] = useState('all');
  const [modalAudience, setModalAudience] = useState('all');

  const modalStoreCatalogInfo = useMemo(() => {
    return getStoreCatalog(priceListModalStore);
  }, [priceListModalStore]);

  const filteredModalItems = useMemo(() => {
    if (!modalStoreCatalogInfo) return [];
    return modalStoreCatalogInfo.items.filter(item => {
      const matchesCat = modalCategory === 'all' || item.serviceKey === modalCategory;
      const matchesAud = modalAudience === 'all' || 
        (modalAudience === 'men' && item.audience.toLowerCase().includes('men')) ||
        (modalAudience === 'women' && item.audience.toLowerCase().includes('women')) ||
        (modalAudience === 'kids' && item.audience.toLowerCase().includes('kid')) ||
        (modalAudience === 'household' && (item.audience.toLowerCase().includes('house') || item.audience.toLowerCase().includes('institution')));

      const q = modalSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.audience.toLowerCase().includes(q);

      return matchesCat && matchesAud && matchesSearch;
    });
  }, [modalStoreCatalogInfo, modalCategory, modalAudience, modalSearch]);

  // ── Request geolocation ──────────────────────────────────────────────────
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setLocationState('denied');
      return;
    }
    setLocationState('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setInternalCoords({ lat, lng });
        if (setAppCoords) setAppCoords({ lat, lng });
        setLocationState('nearby');

        // ── Reverse Geocode via OpenStreetMap Nominatim ──────────────────
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const displayName = data.display_name || '';
          
          const combinedText = `${displayName} ${addr.road || ''} ${addr.suburb || ''} ${addr.neighbourhood || ''}`;
          const sectorMatch = combinedText.match(/Sector\s*\d+[A-Za-z]?/i);
          const sector = sectorMatch ? sectorMatch[0] : null;

          let area = sector || addr.neighbourhood || addr.suburb || addr.residential || 'Sector 94';
          area = area.replace(/\bDadri\b/gi, '').trim() || 'Sector 94';
          
          let city = addr.city || addr.town || addr.state_district || 'Noida';
          city = city.replace(/\bDadri\b/gi, '').trim() || 'Noida';

          const locationLabel = sector ? `${sector}, ${city}` : `${area}, ${city}`;
          if (onLocationDetected) onLocationDetected(locationLabel);
        } catch {
          // Geocoding failed silently
        }
      },
      (err) => {
        setGeoError(
          err.code === 1
            ? 'Location permission was denied.'
            : 'Could not retrieve your location. Please try again.'
        );
        setLocationState('denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Compute nearby stores (sorted by distance) ───────────────────────────
  const nearbyStores = useMemo(() => {
    if (!userCoords) return [];
    return stores
      .map(s => ({ ...s, distance: getDistance(userCoords.lat, userCoords.lng, s.lat, s.lng) }))
      .filter(s => s.distance <= NEARBY_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [userCoords, stores]);

  // Switch to none_nearby state if location resolved but no stores found
  useEffect(() => {
    if (locationState === 'nearby' && userCoords && nearbyStores.length === 0) {
      setLocationState('none_nearby');
    }
  }, [locationState, userCoords, nearbyStores]);

  // ── Browse-mode filtered stores ──────────────────────────────────────────
  const browseFiltered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return stores.filter(store => {
      const matchState = selectedState === ALL_STATES_OPTION || store.state === selectedState;
      if (!q) return matchState;
      const text = [store.name, store.city, store.state, store.address, ...(store.tags || [])].join(' ').toLowerCase();
      return matchState && text.includes(q);
    });
  }, [searchQuery, selectedState, stores]);

  const browseGrouped = useMemo(() => {
    const map = {};
    browseFiltered.forEach(s => { if (!map[s.state]) map[s.state] = []; map[s.state].push(s); });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [browseFiltered]);

  // ── Store Card ────────────────────────────────────────────────────────────
  function StoreCard({ store, showDistance = false }) {
    const isExpanded = expandedStore === store.id;
    const isOpeningSoon = store.status === 'Opening Soon';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

    return (
      <div
        className="glass-card"
        style={{
          padding: '14px',
          border: isExpanded ? '1px solid var(--border-active)' : '1px solid var(--border-glass)',
          borderRadius: '18px',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isExpanded ? '0 8px 24px var(--primary-green-glow)' : undefined,
        }}
        onClick={() => setExpandedStore(isExpanded ? null : store.id)}
      >
        {/* Top Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '9px',
                background: 'rgba(39,162,67,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Store size={15} color="var(--primary-green)" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', lineHeight: 1.3, color: 'var(--text-main)' }}>
                {store.name.replace('Cleanz24 - ', '')}
              </span>
              {isOpeningSoon && (
                <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                  Opening Soon
                </span>
              )}
            </div>

            {/* Distance Badge */}
            {showDistance && store.distance !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Navigation size={11} color="var(--primary-green)" />
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-green)' }}>
                  {formatDistance(store.distance)} away
                </span>
              </div>
            )}

            {/* Address preview */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
              <MapPin size={11} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
              <span style={{
                fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4,
                overflow: isExpanded ? 'visible' : 'hidden',
                display: isExpanded ? 'block' : '-webkit-box',
                WebkitLineClamp: isExpanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}>
                {store.address}
              </span>
            </div>

            {/* Price List Badge on Unexpanded Card */}
            {(() => {
              const catInfo = getStoreCatalog(store);
              return (
                <div style={{ marginTop: '5px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    borderRadius: '6px',
                    background: 'rgba(39,162,67,0.12)',
                    border: '1px solid rgba(39,162,67,0.3)',
                    color: 'var(--primary-green)',
                    fontSize: '10px',
                    fontWeight: '700'
                  }}>
                    📋 {catInfo.shortName} Price List ({catInfo.items.length} Items)
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Rating + Chevron */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
            {!isOpeningSoon && (
              <div style={{
                padding: '4px 8px',
                borderRadius: '10px',
                background: 'rgba(39,162,67,0.1)',
                border: '1px solid rgba(39,162,67,0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: ratingColor(store.rating), lineHeight: 1 }}>{store.rating}</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>{store.reviews} reviews</div>
              </div>
            )}
            <ChevronRight size={16} color="var(--text-subtle)"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.25s ease' }}
            />
          </div>
        </div>

        {/* Expanded Panel */}
        {isExpanded && (
          <div
            style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '10px' }}
            onClick={e => e.stopPropagation()}
          >
            {!isOpeningSoon && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StarRating rating={store.rating} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{store.rating} · {store.reviews} Verified Reviews</span>
              </div>
            )}

            {/* Full address */}
            <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, border: '1px solid var(--border-glass)' }}>
              {store.address}
            </div>

            {/* Tags */}
            {store.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {store.tags.map(tag => (
                  <span key={tag} className="badge badge-green" style={{ fontSize: '10px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Official Store Price List Card & Button ── */}
            {(() => {
              const catInfo = getStoreCatalog(store);
              return (
                <div style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(60, 139, 53, 0.16) 0%, rgba(39, 162, 67, 0.06) 100%)',
                  border: '1px solid var(--border-active)',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📋</span> Store Rate Card ({catInfo.name.replace('Cleanz24 - ', '')})
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '9px', padding: '2px 6px' }}>
                      {catInfo.items.length} Items
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {catInfo.preview}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriceListModalStore(store);
                      setModalSearch('');
                      setModalCategory('all');
                      setModalAudience('all');
                    }}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '10px',
                      background: 'var(--primary-green)',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 10px rgba(39,162,67,0.3)'
                    }}
                  >
                    🔍 View Store Price List ({catInfo.items.length} Items) →
                  </button>
                </div>
              );
            })()}

            {!isOpeningSoon ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Primary Book Pickup Button for This Store */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onStartBooking) onStartBooking(store);
                  }}
                  className="btn-primary"
                  style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px var(--primary-green-glow)'
                  }}
                >
                  <Phone size={16} /> Call to Book Free Pickup
                </button>

                {/* Secondary Actions: Call 9138004800, WhatsApp 9138004800, Maps */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a 
                    href="tel:+919138004800" 
                    style={{ 
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      gap: '6px', padding: '10px', borderRadius: '12px', 
                      background: 'var(--bg-card-subtle)', border: '1px solid var(--border-glass)', 
                      color: 'var(--text-main)', textDecoration: 'none', fontSize: '12px', fontWeight: '700' 
                    }}
                  >
                    <Phone size={13} color="var(--primary-green)" /> Call: 9138004800
                  </a>
                  <a 
                    href={`https://wa.me/919138004800?text=${encodeURIComponent(`Hello Cleanz24, I want to book laundry pickup from *${store.name}* (${store.address}). Please arrange my pickup.`)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      gap: '6px', padding: '10px', borderRadius: '12px', 
                      background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.35)', 
                      color: '#16A34A', textDecoration: 'none', fontSize: '12px', fontWeight: '700' 
                    }}
                  >
                    <MessageCircle size={13} /> WhatsApp Book
                  </a>
                  <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      gap: '6px', padding: '10px', borderRadius: '12px', 
                      background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', 
                      color: '#2563EB', textDecoration: 'none', fontSize: '12px', fontWeight: '700' 
                    }}
                  >
                    <Map size={13} /> Directions
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', fontSize: '12px', color: 'var(--accent-amber)', textAlign: 'center', fontWeight: '600' }}>
                🎉 This store is Opening Soon — Stay tuned!
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Store Price List Modal ────────────────────────────────────────────────
  function renderPriceListModal() {
    if (!priceListModalStore) return null;
    const catalogInfo = getStoreCatalog(priceListModalStore);

    return (
      <div 
        className="modal-overlay" 
        onClick={() => setPriceListModalStore(null)} 
        style={{ zIndex: 2000 }}
      >
        <div 
          className="bottom-sheet animate-fade-in" 
          onClick={e => e.stopPropagation()}
          style={{ height: '90%', display: 'flex', flexDirection: 'column', padding: '16px' }}
        >
          <div className="sheet-handle" />

          {/* Modal Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-green" style={{ fontSize: '10px' }}>
                  <MapPin size={10} /> {catalogInfo.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {catalogInfo.items.length} Items Listed
                </span>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', marginTop: '6px', color: 'var(--text-main)' }}>
                {priceListModalStore.name} Rate Card
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                {priceListModalStore.address}
              </p>
            </div>
            <button 
              className="btn-icon" 
              onClick={() => setPriceListModalStore(null)} 
              style={{ width: '32px', height: '32px', flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginTop: '12px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              placeholder={`Search in ${catalogInfo.items.length} items (e.g. curtains, saree, suit, baniean)...`}
              value={modalSearch}
              onChange={e => setModalSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            {modalSearch && (
              <button 
                onClick={() => setModalSearch('')} 
                style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Service Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '10px 0 6px 0' }}>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'dry_clean', label: 'Dry Clean' },
              { id: 'steam_iron', label: 'Steam Iron' },
              { id: 'laundry', label: 'Laundry' },
              { id: 'shoe_care', label: 'Shoe Spa' },
              { id: 'bags', label: 'Bags' },
              { id: 'accessories', label: 'Accessories' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setModalCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  border: modalCategory === cat.id ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                  background: modalCategory === cat.id ? 'rgba(39, 162, 67, 0.2)' : 'var(--bg-card)',
                  color: modalCategory === cat.id ? 'var(--primary-green)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Audience Sub-Filters */}
          <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '8px' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'men', label: '👔 Men' },
              { id: 'women', label: '👗 Women' },
              { id: 'kids', label: '🧒 Kids' },
              { id: 'household', label: '🏠 Household' }
            ].map(aud => (
              <button
                key={aud.id}
                onClick={() => setModalAudience(aud.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  border: modalAudience === aud.id ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                  background: modalAudience === aud.id ? 'rgba(39, 162, 67, 0.15)' : 'transparent',
                  color: modalAudience === aud.id ? 'var(--primary-green)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {aud.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
            {filteredModalItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No items matching "{modalSearch}" found.
              </div>
            ) : (
              filteredModalItems.map(item => (
                <div 
                  key={item.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '6px', marginTop: '3px' }}>
                      <span style={{ color: 'var(--primary-green)', fontWeight: '600' }}>{item.service}</span>
                      <span>•</span>
                      <span>{item.audience}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                      Rs. {item.price}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.unit}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-glass)', marginTop: '8px' }}>
            <button
              onClick={() => {
                const store = priceListModalStore;
                setPriceListModalStore(null);
                if (onStartBooking) onStartBooking(store);
              }}
              className="btn-primary"
              style={{ flex: 2, padding: '12px', fontSize: '13px' }}
            >
              <Phone size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Call to Book Pickup from {priceListModalStore.city || 'Store'}
            </button>
            <a
              href={`https://wa.me/919138004800?text=${encodeURIComponent(`Hello Cleanz24, I am viewing the price list for ${priceListModalStore.name} (${priceListModalStore.address}). I want to book pickup.`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(37,211,102,0.18)',
                border: '1px solid rgba(37,211,102,0.4)',
                color: '#16A34A',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>

        </div>
      </div>
    );
  }

  // ── RENDER STATES ─────────────────────────────────────────────────────────

  // 1. IDLE — Permission Prompt with integrated search
  if (locationState === 'idle') {
    const idleQuery = searchQuery;
    const idleResults = idleQuery.trim().length >= 2
      ? storesData.filter(store => {
          const text = [store.name, store.city, store.state, store.address, ...(store.tags || [])].join(' ').toLowerCase();
          return text.includes(idleQuery.toLowerCase().trim());
        })
      : [];

    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <style>{pulseStyle}</style>

        {/* Top Hero Section */}
        <div style={{
          padding: '28px 20px 20px',
          background: 'linear-gradient(180deg, rgba(39,162,67,0.1) 0%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0'
        }}>
          {/* Animated GPS graphic */}
          <div style={{ position: 'relative', width: '90px', height: '90px', marginBottom: '18px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '2px solid rgba(39,162,67,0.3)',
                animation: `ripple 2.2s ease-out ${i * 0.55}s infinite`
              }} />
            ))}
            <div style={{
              position: 'absolute', inset: '22px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3C8B35, #27A243)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(39,162,67,0.5)'
            }}>
              <Navigation size={22} color="#FFF" />
            </div>
          </div>

          <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '6px', color: 'var(--text-main)' }}>
            Find Stores &amp; <span className="gradient-text">Price Lists</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6, maxWidth: '260px', marginBottom: '18px' }}>
            Allow location to see nearby studios, or search any city / pincode below
          </p>

          {/* Allow Location Button */}
          <button
            className="btn-primary"
            onClick={requestLocation}
            style={{ padding: '12px 28px', fontSize: '14px', width: '100%', maxWidth: '320px', gap: '8px', marginBottom: '10px' }}
          >
            <Navigation size={16} /> 📍 Allow Location — Find Nearby Stores
          </button>

          {/* Stats strip */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '6px' }}>
            {[['100+', 'Stores'], ['18+', 'States'], ['4.8★', 'Rating']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-green)' }}>{val}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: '600' }}>OR SEARCH WITHOUT LOCATION</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 16px 8px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search city, area, pincode (e.g. Hyderabad, Noida, 500081)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus={false}
            style={{
              width: '100%',
              padding: '12px 40px 12px 40px',
              background: 'var(--input-bg)',
              border: '1.5px solid var(--border-active)',
              borderRadius: '14px',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary-green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-active)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '28px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* State Filter chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '0 16px 8px', scrollbarWidth: 'none' }}>
          {['All States', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Rajasthan', 'Odisha', 'Maharashtra', 'Punjab'].map(state => (
            <button
              key={state}
              onClick={() => { setSelectedState(state); if (state !== 'All States') setSearchQuery(state === 'All States' ? '' : state); }}
              style={{
                flexShrink: 0,
                padding: '5px 11px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                border: selectedState === state ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                background: selectedState === state ? 'rgba(39,162,67,0.18)' : 'var(--pill-bg)',
                color: selectedState === state ? 'var(--primary-green)' : 'var(--text-muted)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {state === 'All States' ? '🗺️ All States' : state}
            </button>
          ))}
        </div>

        {/* Search Results OR Browse-all CTA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {idleQuery.trim().length >= 2 ? (
            idleResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No stores found for "{idleQuery}"</div>
                <div style={{ fontSize: '12px' }}>Try a city name, pincode, or area</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 2px' }}>
                  <strong style={{ color: 'var(--primary-green)' }}>{idleResults.length} store{idleResults.length !== 1 ? 's' : ''}</strong> matching "{idleQuery}"
                </div>
                {idleResults.map(store => <StoreCard key={store.id} store={store} showDistance={false} />)}
              </>
            )
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '12px 0 4px', fontSize: '12px', color: 'var(--text-subtle)' }}>
                Type 2+ characters to search across all stores
              </div>
              <button
                onClick={() => setLocationState('browse')}
                style={{
                  margin: '4px 0',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'var(--bg-card)',
                  border: '1px dashed var(--border-active)',
                  color: 'var(--primary-green)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Store size={15} /> Browse All 100+ Stores →
              </button>
            </>
          )}
        </div>
        {renderPriceListModal()}
      </div>
    );
  }

  // 2. LOADING
  if (locationState === 'loading') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '24px', gap: '20px' }}>
        <style>{pulseStyle}</style>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--border-glass)', borderTopColor: 'var(--primary-green)', animation: 'spin 1s linear infinite' }} />
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', textAlign: 'center', marginBottom: '6px', color: 'var(--text-main)' }}>Detecting your location…</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>Please allow location permission in your browser</div>
        </div>
      </div>
    );
  }

  // 3. DENIED / Error
  if (locationState === 'denied') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '24px', gap: '16px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(244,63,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={32} color="var(--accent-rose)" />
        </div>
        <h3 style={{ fontSize: '18px', textAlign: 'center', color: 'var(--text-main)' }}>Location Access Denied</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '270px', lineHeight: 1.6 }}>
          {geoError || 'We could not access your location.'} You can still browse our stores across India manually.
        </p>
        <button className="btn-primary" onClick={requestLocation} style={{ width: 'auto', padding: '12px 28px' }}>
          <Navigation size={16} /> Try Again
        </button>
        <button onClick={() => setLocationState('browse')} style={{ background: 'none', border: 'none', color: 'var(--primary-green)', fontSize: '13px', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}>
          Browse all stores
        </button>
      </div>
    );
  }

  // 4. NO STORES NEARBY
  if (locationState === 'none_nearby') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', padding: '24px', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>🗺️</div>
        <h3 style={{ fontSize: '18px', textAlign: 'center', color: 'var(--text-main)' }}>No Stores Within 20 km</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '270px', lineHeight: 1.6 }}>
          We don't have a Cleanz24 studio near you yet, but we're expanding fast! Browse our nationwide network below.
        </p>
        <button className="btn-primary" onClick={() => setLocationState('browse')} style={{ width: 'auto', padding: '12px 28px' }}>
          Browse All Stores <ArrowRight size={16} />
        </button>
        <button onClick={() => setLocationState('idle')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
          ← Back
        </button>
      </div>
    );
  }

  // 5. NEARBY RESULTS
  if (locationState === 'nearby') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header with Adaptive Theme Background */}
        <div style={{
          padding: '16px',
          background: 'var(--header-gradient)',
          borderBottom: '1px solid var(--border-glass)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', boxShadow: '0 0 8px var(--primary-green)', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'var(--primary-green)', fontWeight: '700', letterSpacing: '0.3px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {appLocation ? appLocation.toUpperCase() : 'LOCATION DETECTED'}
                </span>
                {onOpenLocationPicker && (
                  <button 
                    onClick={onOpenLocationPicker}
                    style={{
                      background: 'rgba(39,162,67,0.12)',
                      border: '1px solid rgba(39,162,67,0.3)',
                      color: 'var(--primary-green)',
                      fontSize: '10px',
                      fontWeight: '700',
                      borderRadius: '6px',
                      padding: '2px 7px',
                      cursor: 'pointer'
                    }}
                  >
                    Change 📍
                  </button>
                )}
              </div>
              <h2 style={{ fontSize: '20px', marginTop: '2px', color: 'var(--text-main)' }}>
                <span className="gradient-text">{nearbyStores.length}</span> Stores Near You
              </h2>
            </div>
            <button
              onClick={() => setLocationState('browse')}
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <Search size={13} /> Browse All
            </button>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing stores within <strong style={{ color: 'var(--primary-green)' }}>{NEARBY_KM} km</strong> · sorted by distance
          </div>
        </div>

        {/* Nearby Store List */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Central Customer Care & Direct Booking Support Bar */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(39, 162, 67, 0.12), rgba(60, 139, 53, 0.06))',
            border: '1px solid rgba(39, 162, 67, 0.35)',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '4px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Franchise Booking Desk</span>
                <span className="badge badge-green" style={{ fontSize: '9px', padding: '2px 6px' }}>7 AM - 10 PM</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Call or WhatsApp our central support team at <strong>+91 9138004800</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <a 
                href="tel:+919138004800"
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--primary-green)', color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', boxShadow: '0 3px 10px rgba(39,162,67,0.4)'
                }}
                title="Call 9138004800"
              >
                <Phone size={16} />
              </a>
              <a 
                href={`https://wa.me/919138004800?text=${encodeURIComponent(`Hello Cleanz24, I want to book laundry pickup near ${appLocation || 'Noida'}`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: '#25D366', color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', boxShadow: '0 3px 10px rgba(37,211,102,0.4)'
                }}
                title="WhatsApp 9138004800"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {nearbyStores.map(store => (
            <StoreCard key={store.id} store={store} showDistance={true} />
          ))}
          {/* Browse All CTA */}
          <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px dashed var(--border-active)', borderRadius: '16px', textAlign: 'center', marginTop: '6px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Looking for more? We have 100+ stores across India.</div>
            <button
              onClick={() => setLocationState('browse')}
              className="btn-secondary"
              style={{ width: 'auto', padding: '10px 20px', fontSize: '13px', display: 'inline-flex', gap: '6px' }}
            >
              Browse All Stores <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ height: '8px' }} />
        </div>
        {renderPriceListModal()}
      </div>
    );
  }

  // 6. BROWSE ALL
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'var(--header-gradient)',
        padding: '16px',
        borderBottom: '1px solid var(--border-glass)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', color: 'var(--text-main)' }}>Find a <span className="gradient-text">Store</span></h2>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
              {searchQuery || selectedState !== ALL_STATES_OPTION 
                ? `${browseFiltered.length} store${browseFiltered.length !== 1 ? 's' : ''} found` 
                : '100+ stores across 18+ states'}
            </div>
          </div>
          {userCoords ? (
            <button
              onClick={() => setLocationState('nearby')}
              style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(39,162,67,0.15)', border: '1px solid rgba(39,162,67,0.4)', color: 'var(--primary-green)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Navigation size={13} /> Near Me
            </button>
          ) : (
            <button
              onClick={requestLocation}
              style={{ padding: '8px 14px', borderRadius: '12px', background: 'rgba(39,162,67,0.15)', border: '1px solid rgba(39,162,67,0.4)', color: 'var(--primary-green)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Navigation size={13} /> Use Location
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search city, area, pincode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 36px 11px 38px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-glass)',
              borderRadius: '13px',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary-green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-glass)'}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* State Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['All States', 'Uttar Pradesh', 'Telangana', 'Kerala', 'Rajasthan', 'Odisha', 'Maharashtra', 'Punjab', 'Uttarakhand'].map(state => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '600',
                border: selectedState === state ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                background: selectedState === state ? 'rgba(39,162,67,0.18)' : 'var(--pill-bg)',
                color: selectedState === state ? 'var(--primary-green)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
            >
              {state === 'All States' ? '🗺️ All' : state}
            </button>
          ))}
        </div>
      </div>

      {/* Store List */}
      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {browseFiltered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>No stores found</div>
            <div style={{ fontSize: '13px' }}>Try a different city, area, or pincode</div>
            <button onClick={() => { setSearchQuery(''); setSelectedState(ALL_STATES_OPTION); }} style={{ marginTop: '14px', padding: '10px 20px', borderRadius: '12px', background: 'rgba(39,162,67,0.15)', border: '1px solid rgba(39,162,67,0.4)', color: 'var(--primary-green)', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          browseGrouped.map(([state, stores]) => (
            <div key={state}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--border-glass), transparent)' }} />
                <div style={{ padding: '4px 12px', background: 'rgba(39,162,67,0.12)', border: '1px solid rgba(39,162,67,0.3)', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: 'var(--primary-green)', whiteSpace: 'nowrap' }}>
                  📍 {state} · {stores.length} store{stores.length !== 1 ? 's' : ''}
                </div>
                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, var(--border-glass))' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stores.map(store => <StoreCard key={store.id} store={store} showDistance={false} />)}
              </div>
            </div>
          ))
        )}
        <div style={{ height: '8px' }} />
      </div>
      {renderPriceListModal()}
    </div>
  );
}
