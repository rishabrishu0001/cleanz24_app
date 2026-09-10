import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Clock, Truck, ShieldCheck, ArrowRight, Shirt, 
  Layers, Package, Zap, MapPin, Phone, MessageCircle, ChevronRight, ChevronDown, Search, Navigation, X, Award, Crown, User
} from 'lucide-react';
import storesData from '../data/stores.json';
import { findNearestStore } from '../services/storeCatalogs.js';

// Dynamic rate resolver for each store based on actual catalog / pricing
function getStoreEstimatorRates(store) {
  if (!store) {
    return {
      storeName: 'Cleanz24 - Sector 41 Noida',
      shortName: 'Sector 41, Noida',
      city: 'Noida',
      state: 'Uttar Pradesh',
      wash_fold: 80,
      wash_iron: 110,
      dry_clean: 139,
      studioKey: 'noida41'
    };
  }
  const s = `${store.name || ''} ${store.address || ''} ${store.city || ''} ${store.state || ''}`.toLowerCase();
  
  if (s.includes('137 noida') || s.includes('sector 137')) {
    return { storeName: store.name, shortName: 'Sector 137, Noida', city: store.city, state: store.state, wash_fold: 90, wash_iron: 120, dry_clean: 149, studioKey: 'noida137' };
  }
  if (s.includes('nirala') || s.includes('patwari') || s.includes('tech zone')) {
    return { storeName: store.name, shortName: 'Nirala Estate, Gr. Noida', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'niralaestate' };
  }
  if (s.includes('sector 41') || (s.includes('noida') && !s.includes('extension'))) {
    return { storeName: store.name, shortName: 'Sector 41, Noida', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 139, studioKey: 'noida41' };
  }
  if (s.includes('vaishali') || s.includes('ghaziabad') || s.includes('indirapuram')) {
    return { storeName: store.name, shortName: 'Vaishali, Ghaziabad', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 139, studioKey: 'vaishali' };
  }
  if (s.includes('ib nagar') || s.includes('vanasthalipuram') || s.includes('seshadri')) {
    return { storeName: store.name, shortName: 'IB Nagar, Hyderabad', city: store.city, state: store.state, wash_fold: 100, wash_iron: 130, dry_clean: 149, studioKey: 'ibnagar' };
  }
  if (s.includes('gopanpally')) {
    return { storeName: store.name, shortName: 'Gopanpally, Hyderabad', city: store.city, state: store.state, wash_fold: 100, wash_iron: 130, dry_clean: 149, studioKey: 'gopanpally' };
  }
  if (s.includes('kondapur')) {
    return { storeName: store.name, shortName: 'Kondapur, Hyderabad', city: store.city, state: store.state, wash_fold: 100, wash_iron: 130, dry_clean: 149, studioKey: 'kondapur' };
  }
  if (s.includes('kokapet')) {
    return { storeName: store.name, shortName: 'Kokapet, Hyderabad', city: store.city, state: store.state, wash_fold: 100, wash_iron: 130, dry_clean: 149, studioKey: 'kokapet' };
  }
  if (s.includes('narsingi') || s.includes('skyrena')) {
    return { storeName: store.name, shortName: 'Narsingi, Hyderabad', city: store.city, state: store.state, wash_fold: 80, wash_iron: 120, dry_clean: 149, studioKey: 'narsingi' };
  }
  if (s.includes('roorkee') || s.includes('haridwar') || s.includes('bhandari')) {
    return { storeName: store.name, shortName: 'Roorkee', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'roorkee' };
  }
  if (s.includes('gachibowli')) {
    return { storeName: store.name, shortName: 'Gachibowli, Hyderabad', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'gachibowli' };
  }
  if (s.includes('beeramguda')) {
    return { storeName: store.name, shortName: 'Beeramguda, Sangareddy', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 129, studioKey: 'beeramguda' };
  }
  if (s.includes('kowkoor')) {
    return { storeName: store.name, shortName: 'Kowkoor, Secunderabad', city: store.city, state: store.state, wash_fold: 85, wash_iron: 130, dry_clean: 139, studioKey: 'kowkoor' };
  }
  if (s.includes('alibag') || s.includes('raigad')) {
    return { storeName: store.name, shortName: 'Alibag', city: store.city, state: store.state, wash_fold: 120, wash_iron: 140, dry_clean: 169, studioKey: 'alibag' };
  }
  if (s.includes('thane') || s.includes('ghodbunder')) {
    return { storeName: store.name, shortName: 'Thane West', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'thane' };
  }
  if (s.includes('amritsar') || s.includes('sultanwind')) {
    return { storeName: store.name, shortName: 'Amritsar', city: store.city, state: store.state, wash_fold: 88, wash_iron: 121, dry_clean: 149, studioKey: 'amritsar' };
  }
  if (s.includes('purnia') || s.includes('khazanchi')) {
    return { storeName: store.name, shortName: 'Purnia, Bihar', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 129, studioKey: 'purnia' };
  }
  if (s.includes('bhopal')) {
    return { storeName: store.name, shortName: 'Bhopal', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 119, studioKey: 'bhopal' };
  }
  if (s.includes('thampanoor')) {
    return { storeName: store.name, shortName: 'Thampanoor, Trivandrum', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'thampanoor' };
  }
  if (s.includes('kazhak') || s.includes('trivandrum')) {
    return { storeName: store.name, shortName: 'Kazhakkoottam, Trivandrum', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'kazhakootam' };
  }
  if (s.includes('siwara')) {
    return { storeName: store.name, shortName: 'Siwara, Rajasthan', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'siwara' };
  }
  if (s.includes('sanchore')) {
    return { storeName: store.name, shortName: 'Sanchore, Rajasthan', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'sanchore' };
  }
  if (s.includes('bhilwara')) {
    return { storeName: store.name, shortName: 'Bhilwara, Rajasthan', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'bhilwara' };
  }
  if (s.includes('cuttack')) {
    return { storeName: store.name, shortName: 'CDA Cuttack', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'cuttack' };
  }
  if (s.includes('old town') || s.includes('kharakhia')) {
    return { storeName: store.name, shortName: 'Old Town, Bhubaneswar', city: store.city, state: store.state, wash_fold: 75, wash_iron: 100, dry_clean: 129, studioKey: 'oldtown' };
  }
  if (s.includes('brahmapur') || s.includes('berhampur')) {
    return { storeName: store.name, shortName: 'Brahmapur', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'brahmapur' };
  }
  if (s.includes('jeypore')) {
    return { storeName: store.name, shortName: 'Jeypore', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'jeypore' };
  }
  if (s.includes('jatni')) {
    return { storeName: store.name, shortName: 'Jatni, Khordha', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'jatni' };
  }
  if (s.includes('nadiad') || s.includes('gujarat')) {
    return { storeName: store.name, shortName: 'Nadiad, Gujarat', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'nadiad' };
  }
  if (s.includes('siliguri') || s.includes('bengal') || s.includes('ashram para') || s.includes('hakim para')) {
    return { storeName: store.name, shortName: 'Siliguri, West Bengal', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 129, studioKey: 'siliguri' };
  }
  if (s.includes('kharar') || s.includes('sbp') || s.includes('sector 127')) {
    return { storeName: store.name, shortName: 'Kharar, Punjab', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 129, studioKey: 'kharar' };
  }
  if (s.includes('patiala') || s.includes('urban estate') || s.includes('sco 258')) {
    return { storeName: store.name, shortName: 'Patiala, Punjab', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 119, studioKey: 'patiala' };
  }
  if (s.includes('angul') || s.includes('amalapada') || s.includes('gandhimarg')) {
    return { storeName: store.name, shortName: 'Angul, Odisha', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'angul' };
  }
  if (s.includes('palasuni') || s.includes('satya vihar') || s.includes('rasulgarh')) {
    return { storeName: store.name, shortName: 'Palasuni, Bhubaneswar', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'palasuni' };
  }
  if (s.includes('odisha') || s.includes('bhubaneswar')) {
    return { storeName: store.name, shortName: store.city || 'Odisha', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'brahmapur' };
  }
  if (s.includes('udaipur') || s.includes('panchwati') || s.includes('alok school') || s.includes('rk mall')) {
    return { storeName: store.name, shortName: 'Udaipur, Rajasthan', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'udaipur' };
  }
  if (s.includes('rajasthan')) {
    return { storeName: store.name, shortName: store.city || 'Rajasthan', city: store.city, state: store.state, wash_fold: 70, wash_iron: 100, dry_clean: 119, studioKey: 'siwara' };
  }
  if (s.includes('punjab') || s.includes('haryana')) {
    return { storeName: store.name, shortName: store.city || 'Punjab', city: store.city, state: store.state, wash_fold: 88, wash_iron: 121, dry_clean: 149, studioKey: 'amritsar' };
  }
  if (s.includes('parad') || s.includes('parat') || s.includes('kunnothuparamba')) {
    return { storeName: store.name, shortName: 'Parad, Kerala', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'parad' };
  }
  if (s.includes('mahe') || s.includes('poozhithala') || s.includes('puducherry') || s.includes('pondicherry')) {
    return { storeName: store.name, shortName: 'Mahe, Puducherry', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'mahe' };
  }
  if (s.includes('kerala')) {
    return { storeName: store.name, shortName: store.city || 'Kerala', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 149, studioKey: 'kazhakootam' };
  }
  if (s.includes('telangana') || s.includes('hyderabad')) {
    return { storeName: store.name, shortName: store.city || 'Hyderabad', city: store.city, state: store.state, wash_fold: 85, wash_iron: 110, dry_clean: 139, studioKey: 'gachibowli' };
  }
  if (s.includes('maharashtra') || s.includes('pune') || s.includes('mumbai')) {
    return { storeName: store.name, shortName: store.city || 'Maharashtra', city: store.city, state: store.state, wash_fold: 100, wash_iron: 130, dry_clean: 149, studioKey: 'thane' };
  }
  return { storeName: store.name, shortName: store.city || 'Studio', city: store.city, state: store.state, wash_fold: 80, wash_iron: 110, dry_clean: 139, studioKey: 'noida41' };
}

const studioImages = [
  {
    url: '/images/storefront_hero.jpg',
    title: 'Flagship Studio Entrance',
    desc: 'Modern eco-friendly retail dry cleaning experience'
  },
  {
    url: '/images/store_interior.jpg',
    title: 'High-Tech Steam & Press Studio',
    desc: 'Computerized steam pressing & fabric sanitization'
  },
  {
    url: '/images/store_entrance.jpg',
    title: 'Express Counter & Valet Hub',
    desc: 'Barcoded garment tracking & quick pickup station'
  },
  {
    url: '/images/studio_counter.jpg',
    title: 'Premium Dry Clean Studio',
    desc: '100% Eco-friendly organic solvents & delicate fabric care'
  },
  {
    url: '/images/studio_machinery.jpg',
    title: 'High-Tech Processing & Care',
    desc: 'Commercial Girbau machinery & hygienic fabric care'
  }
];

export default function HomeScreen({ 
  onStartBooking, 
  onNavigateTab, 
  activeOrder,
  currentUser,
  userName = "Guest",
  onOpenAuthModal,
  selectedStudio = 'noida41',
  onStudioChange,
  userCoords,
  userLocation,
  onRequestLocation
}) {
  // Quick Estimator State - Store Driven
  const [estimatedWeight, setEstimatedWeight] = useState(7); // in kg
  const [selectedEstimatorService, setSelectedEstimatorService] = useState('wash_fold');

  // Compute initial store from userCoords & location or selectedStudio
  const initialNearest = useMemo(() => {
    return findNearestStore(userCoords, userLocation || '');
  }, [userCoords, userLocation]);

  const [selectedEstimatorStoreId, setSelectedEstimatorStoreId] = useState(initialNearest?.store?.id || 1);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');

  // Auto-sync estimator store when user location / coords or selectedStudio changes
  useEffect(() => {
    if (userCoords || userLocation) {
      const nearest = findNearestStore(userCoords, userLocation);
      if (nearest?.store?.id) {
        setSelectedEstimatorStoreId(nearest.store.id);
        if (onStudioChange && nearest.studioKey) {
          onStudioChange(nearest.studioKey);
        }
      }
    }
  }, [userCoords, userLocation]);

  // Selected store object for Estimator
  const selectedEstimatorStore = useMemo(() => {
    return storesData.find(s => s.id === selectedEstimatorStoreId) || storesData[0];
  }, [selectedEstimatorStoreId]);

  // Store rates calculated from the chosen store
  const currentRates = useMemo(() => {
    return getStoreEstimatorRates(selectedEstimatorStore);
  }, [selectedEstimatorStore]);

  const estimatedTotal = (currentRates[selectedEstimatorService] || 80) * estimatedWeight;

  // Filtered stores for Estimator Search/Dropdown
  const filteredEstimatorStores = useMemo(() => {
    const q = storeSearchQuery.trim().toLowerCase();
    if (!q) return storesData;
    return storesData.filter(s => {
      const txt = `${s.name} ${s.city} ${s.state} ${s.address} ${(s.tags || []).join(' ')}`.toLowerCase();
      return txt.includes(q);
    });
  }, [storeSearchQuery]);

  const handleSelectEstimatorStore = (store) => {
    setSelectedEstimatorStoreId(store.id);
    setIsStoreDropdownOpen(false);
    setStoreSearchQuery('');
    const rates = getStoreEstimatorRates(store);
    if (onStudioChange && rates.studioKey) {
      onStudioChange(rates.studioKey);
    }
  };

  const POPULAR_ESTIMATOR_STORE_IDS = [1, 2, 58, 11, 12, 16, 37, 74, 63];

  // Home store search state
  const [homeStoreSearch, setHomeStoreSearch] = useState('');

  const homeStoreResults = useMemo(() => {
    const q = homeStoreSearch.trim().toLowerCase();
    if (q.length < 2) return [];
    return storesData.filter(store => {
      const text = [store.name, store.city, store.state, store.address, ...(store.tags || [])].join(' ').toLowerCase();
      return text.includes(q);
    }).slice(0, 5); // show max 5 results on home
  }, [homeStoreSearch]);

  // Quick rate lookup for a store name
  const getStoreQuickRates = (store) => {
    const s = `${store.name} ${store.address} ${store.city} ${store.state}`.toLowerCase();
    if (s.includes('noida') && s.includes('137')) return { wf: 90, wi: 120 };
    if (s.includes('nirala') || s.includes('patwari') || s.includes('greater noida')) return { wf: 80, wi: 110 };
    if (s.includes('noida')) return { wf: 80, wi: 110 };
    if (s.includes('vaishali') || s.includes('ghaziabad') || s.includes('indirapuram')) return { wf: 80, wi: 110 };
    if (s.includes('ib nagar') || s.includes('vanasthalipuram')) return { wf: 100, wi: 130 };
    if (s.includes('gopanpally') || s.includes('kondapur') || s.includes('kokapet')) return { wf: 100, wi: 130 };
    if (s.includes('narsingi')) return { wf: 80, wi: 120 };
    if (s.includes('roorkee') || s.includes('haridwar') || s.includes('uttarakhand')) return { wf: 80, wi: 110 };
    if (s.includes('gachibowli') || s.includes('beeramguda') || s.includes('bhopal') || s.includes('kukatpally')) return { wf: 80, wi: 110 };
    if (s.includes('kowkoor')) return { wf: 85, wi: 130 };
    if (s.includes('hyderabad') || s.includes('telangana') || s.includes('secunderabad')) return { wf: 85, wi: 110 };
    if (s.includes('thane') || s.includes('ghodbunder')) return { wf: 80, wi: 110 };
    if (s.includes('alibag') || s.includes('raigad')) return { wf: 120, wi: 140 };
    if (s.includes('wakad') || s.includes('maharashtra')) return { wf: 100, wi: 130 };
    if (s.includes('thampanoor') || s.includes('kazhak') || s.includes('trivandrum') || s.includes('kerala')) return { wf: 80, wi: 110 };
    if (s.includes('kharar') || s.includes('patiala')) return { wf: 80, wi: 110 };
    if (s.includes('amritsar') || s.includes('punjab') || s.includes('bathinda')) return { wf: 88, wi: 121 };
    if (s.includes('sanchore') || s.includes('siwara') || s.includes('bhilwara') || s.includes('rajasthan') || s.includes('udaipur') || s.includes('churu')) return { wf: 70, wi: 100 };
    if (s.includes('jatni') || s.includes('khordha') || s.includes('cuttack') || s.includes('jeypore') || s.includes('brahmapur') || s.includes('odisha') || s.includes('bhubaneswar')) return { wf: 70, wi: 100 };
    if (s.includes('purnia') || s.includes('bihar')) return { wf: 80, wi: 110 };
    if (s.includes('bengaluru') || s.includes('karnataka')) return { wf: 90, wi: 120 };
    return { wf: 80, wi: 110 };
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {currentUser?.isLoggedIn ? 'Welcome back 👋' : 'Welcome to Cleanz24 👋'}
          </div>
          <h2 style={{ fontSize: '22px', marginTop: '2px' }}>
            Hello, <span className="gradient-text">{userName}</span>
          </h2>
        </div>

        {currentUser?.isLoggedIn && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(39, 162, 67, 0.15)',
            border: '1px solid rgba(39, 162, 67, 0.35)',
            borderRadius: '20px',
            fontSize: '12px',
            color: 'var(--primary-green)',
            fontWeight: '600'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', boxShadow: '0 0 8px var(--primary-green)' }} />
            Pickup Available Today
          </div>
        )}
      </div>

      {/* Dynamic Nearest Studio Location Card */}
      <div 
        className="glass-card" 
        style={{
          padding: '12px 14px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(39, 162, 67, 0.12) 0%, rgba(22, 163, 74, 0.04) 100%)',
          border: '1px solid rgba(39, 162, 67, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'rgba(39, 162, 67, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-green)',
            flexShrink: 0
          }}>
            <MapPin size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--primary-green)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              📍 Nearest Serving Studio
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedEstimatorStore.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
              {userLocation ? `Location: ${userLocation}` : 'Doorstep Pickup Active'}
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            const rates = getStoreEstimatorRates(selectedEstimatorStore);
            if (onStudioChange && rates.studioKey) {
              onStudioChange(rates.studioKey);
            }
            onNavigateTab('services');
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-active)',
            color: 'var(--primary-green)',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          View Rates <ArrowRight size={13} />
        </button>
      </div>

      {/* Direct Contact & Instant Booking Card (Call & WhatsApp) */}
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(135deg, rgba(60, 139, 53, 0.14) 0%, rgba(39, 162, 67, 0.08) 100%)',
          border: '1px solid var(--border-active)',
          position: 'relative',
          overflow: 'hidden',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--primary-green)" /> Direct Booking & Customer Support
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Call or WhatsApp us directly for instant doorstep pickup
            </div>
          </div>
          <span className="badge badge-green" style={{ fontSize: '10px', padding: '4px 8px' }}>
            Instant Contact
          </span>
        </div>

        {/* Quick Direct Actions: Call 9138004800 & WhatsApp */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <a 
            href="tel:+919138004800"
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <Phone size={14} color="var(--primary-green)" /> Call: 9138004800
          </a>

          <a 
            href="https://wa.me/919138004800?text=Hello%20Cleanz24,%20I%20want%20to%20book%20a%20laundry%20/%20dry%20cleaning%20pickup."
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(37,211,102,0.18)',
              border: '1px solid rgba(37,211,102,0.4)',
              color: '#16A34A',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <MessageCircle size={15} /> WhatsApp Support
          </a>
        </div>
      </div>

      {/* Main Studio Showcase Hero Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        minHeight: '230px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '20px'
      }}>
        {/* Background Image - Real Storefront Photo */}
        <img 
          src="/images/storefront_hero.jpg" 
          alt="Cleanz24 Dry Clean Studio Storefront" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.55) contrast(1.05)'
          }}
        />

        {/* Overlay Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge badge-green" style={{ marginBottom: '8px' }}>
            <Sparkles size={12} /> THE DRY CLEAN STUDIO
          </span>
          
          <h3 style={{ fontSize: '21px', lineHeight: '1.25', color: '#FFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Premium Garment Dry Clean & Steam Press Studio
          </h3>
          
          <p style={{ fontSize: '12px', color: '#DCFCE7', margin: '6px 0 14px 0' }}>
            Free doorstep pickup & delivery • ISO 9001:2015 Certified
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onStartBooking} style={{ width: 'auto', padding: '12px 22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} /> Call to Book Pickup
            </button>
            <a 
              href="tel:+919138004800" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '12px 18px', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.12)', 
                color: '#FFF', 
                textDecoration: 'none', 
                fontSize: '13px', 
                fontWeight: '700',
                border: '1px solid rgba(255,255,255,0.2)' 
              }}
            >
              📞 9138004800
            </a>
          </div>
        </div>
      </div>

      {/* Real Cleanz24 Studios Horizontal Photo Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px' }}>Inside Cleanz24 Studios</h3>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>100+ Stores • Trusted by 2 Lacs+ Customers</div>
          </div>
          <span className="badge badge-green">Verified Studios</span>
        </div>

        {/* Horizontal Scrollable Real Photo Cards */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          overflowX: 'auto', 
          paddingBottom: '6px'
        }}>
          {studioImages.map((s, idx) => (
            <div 
              key={idx}
              className="glass-card interactive"
              style={{
                minWidth: '250px',
                height: '150px',
                padding: '0',
                overflow: 'hidden',
                borderRadius: '18px',
                position: 'relative',
                flexShrink: 0,
                border: '1px solid var(--border-active)'
              }}
            >
              <img 
                src={s.url} 
                alt={s.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11, 20, 13, 0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                color: '#FFF'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '800', lineHeight: '1.2' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '10px', color: '#DCFCE7', marginTop: '2px' }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Categories Quick Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px' }}>Our Services</h3>
          <span 
            onClick={() => onNavigateTab('services')} 
            style={{ fontSize: '13px', color: 'var(--primary-green)', cursor: 'pointer', fontWeight: '600' }}
          >
            See All Catalog →
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Wash & Fold */}
          <div 
            onClick={() => onNavigateTab('services')}
            className="glass-card interactive" 
            style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(39, 162, 67, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-green)'
            }}>
              <Shirt size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Wash & Fold</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily clothes, socks & towels</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-green)', marginTop: '4px' }}>
                From Rs. 49 / kg
              </div>
            </div>
          </div>

          {/* Dry Cleaning */}
          <div 
            onClick={() => onNavigateTab('services')}
            className="glass-card interactive" 
            style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <Layers size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Eco Dry Cleaning</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Suits, dresses & silk wear</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                From Rs. 149 / item
              </div>
            </div>
          </div>

          {/* Shoe & Leather Care */}
          <div 
            onClick={() => onNavigateTab('services')}
            className="glass-card interactive" 
            style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>Shoe Revive</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sneakers & leather restoration</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-amber)', marginTop: '4px' }}>
                From Rs. 299 / pair
              </div>
            </div>
          </div>

          {/* Express 24h */}
          <div 
            onClick={onStartBooking}
            className="glass-card interactive" 
            style={{ 
              padding: '14px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              cursor: 'pointer',
              border: '1px solid rgba(39, 162, 67, 0.4)',
              background: 'rgba(39, 162, 67, 0.08)'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(39, 162, 67, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-green)'
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-green)' }}>24h Express Rush</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Same-day pickup & delivery</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-green)', marginTop: '4px' }}>
                Guaranteed 24h
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Instant Price Estimator Slider Widget — Store-Driven */}
      <div className="glass-card" style={{ padding: '18px', border: '1px solid var(--border-active)' }}>
        {/* Estimator Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h4 style={{ fontSize: '15px' }}>Instant Price Estimator</h4>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real rates by store • Select your studio</div>
          </div>
          <span className="badge badge-green">Free Pickup &gt; Rs. 300</span>
        </div>

        {/* Store Selector Dropdown & Search */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <div
            onClick={() => setIsStoreDropdownOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '14px',
              border: isStoreDropdownOpen ? '1.5px solid var(--primary-green)' : '1px solid var(--border-glass)',
              background: 'var(--bg-card-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isStoreDropdownOpen ? '0 0 12px rgba(39, 162, 67, 0.2)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(39, 162, 67, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={16} color="var(--primary-green)" />
              </div>
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {selectedEstimatorStore.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selectedEstimatorStore.city}, {selectedEstimatorStore.state} • Tap to change store
                </div>
              </div>
            </div>
            <ChevronDown 
              size={18} 
              color="var(--text-muted)" 
              style={{ 
                transform: isStoreDropdownOpen ? 'rotate(180deg)' : 'none', 
                transition: 'transform 0.2s', 
                flexShrink: 0, 
                marginLeft: '8px' 
              }} 
            />
          </div>

          {/* Searchable Store Dropdown List */}
          {isStoreDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              zIndex: 90,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-active)',
              borderRadius: '16px',
              padding: '10px',
              boxShadow: '0 16px 36px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              maxHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                <input
                  type="text"
                  placeholder="Search store name, city or area..."
                  value={storeSearchQuery}
                  onChange={(e) => setStoreSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '9px 10px 9px 32px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                {storeSearchQuery && (
                  <button
                    onClick={() => setStoreSearchQuery('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div style={{ overflowY: 'auto', maxHeight: '230px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredEstimatorStores.length === 0 ? (
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                    No stores found for "{storeSearchQuery}"
                  </div>
                ) : (
                  filteredEstimatorStores.map(store => {
                    const isSelected = store.id === selectedEstimatorStoreId;
                    const r = getStoreEstimatorRates(store);
                    return (
                      <div
                        key={store.id}
                        onClick={() => handleSelectEstimatorStore(store)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(39, 162, 67, 0.16)' : 'var(--bg-card-subtle)',
                          border: isSelected ? '1px solid var(--primary-green)' : '1px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                          <div style={{ fontSize: '12px', fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--primary-green)' : 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {store.name.replace('Cleanz24 - ', '')}
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {store.city}, {store.state} • Wash & Fold ₹{r.wash_fold}/kg
                          </div>
                        </div>
                        {isSelected && <ShieldCheck size={16} color="var(--primary-green)" style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Popular Store Chips */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          marginBottom: '12px'
        }}>
          {POPULAR_ESTIMATOR_STORE_IDS.map(id => {
            const st = storesData.find(s => s.id === id);
            if (!st) return null;
            const isAct = st.id === selectedEstimatorStoreId;
            const r = getStoreEstimatorRates(st);
            return (
              <button
                key={id}
                onClick={() => handleSelectEstimatorStore(st)}
                style={{
                  flexShrink: 0,
                  padding: '5px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: isAct ? '800' : '600',
                  whiteSpace: 'nowrap',
                  border: isAct ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                  background: isAct ? 'linear-gradient(135deg, #3C8B35, #27A243)' : 'var(--bg-card-subtle)',
                  color: isAct ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapPin size={10} />
                {r.shortName}
              </button>
            );
          })}
        </div>

        {/* Active Store Rate Badge */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '14px',
          padding: '8px 10px',
          background: 'rgba(39, 162, 67, 0.07)',
          borderRadius: '10px',
          border: '1px dashed rgba(39, 162, 67, 0.3)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} color="var(--primary-green)" />
            <strong style={{ color: 'var(--primary-green)' }}>{currentRates.shortName}</strong> rates:
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Wash & Fold <strong style={{ color: 'var(--text-main)' }}>₹{currentRates.wash_fold}/kg</strong></span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Wash & Iron <strong style={{ color: 'var(--text-main)' }}>₹{currentRates.wash_iron}/kg</strong></span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dry Clean <strong style={{ color: 'var(--text-main)' }}>₹{currentRates.dry_clean}/item</strong></span>
        </div>

        {/* Service Type Selector Chips (NO EMOJIS) */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {[
            { id: 'wash_fold', label: 'Wash & Fold', icon: Shirt, rate: `₹${currentRates.wash_fold}/kg` },
            { id: 'wash_iron', label: 'Wash & Iron', icon: Layers, rate: `₹${currentRates.wash_iron}/kg` },
            { id: 'dry_clean', label: 'Dry Clean', icon: Sparkles, rate: `₹${currentRates.dry_clean}/item` }
          ].map(chip => {
            const IconComp = chip.icon;
            const isSel = selectedEstimatorService === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedEstimatorService(chip.id)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: isSel ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                  background: isSel ? 'rgba(39, 162, 67, 0.16)' : 'var(--bg-card-subtle)',
                  color: isSel ? 'var(--primary-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconComp size={12} color={isSel ? 'var(--primary-green)' : 'var(--text-muted)'} />
                  <span>{chip.label}</span>
                </div>
                <span style={{ fontSize: '10px', opacity: 0.85, fontWeight: '700' }}>{chip.rate}</span>
              </button>
            );
          })}
        </div>

        {/* Quantity / Weight Slider */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
            <span>Estimated Weight / Quantity:</span>
            <strong style={{ color: 'var(--primary-green)' }}>
              {estimatedWeight} {selectedEstimatorService === 'dry_clean' ? 'items' : 'kg'}
            </strong>
          </div>

          <input 
            type="range" 
            min="2" 
            max="25" 
            value={estimatedWeight}
            onChange={(e) => setEstimatedWeight(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--primary-green)',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-subtle)', marginTop: '2px' }}>
            <span>2 {selectedEstimatorService === 'dry_clean' ? 'items' : 'kg'}</span>
            <span>25 {selectedEstimatorService === 'dry_clean' ? 'items' : 'kg'}</span>
          </div>
        </div>

        {/* Price Breakdown Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px dashed var(--border-glass)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Est. for {currentRates.shortName}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
              Rs. {estimatedTotal}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {estimatedWeight} {selectedEstimatorService === 'dry_clean' ? 'items' : 'kg'} × ₹{currentRates[selectedEstimatorService]}/{selectedEstimatorService === 'dry_clean' ? 'item' : 'kg'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
            <button className="btn-primary" onClick={onStartBooking} style={{ width: 'auto', padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} /> Call to Book
            </button>
            <button
              onClick={() => {
                if (onStudioChange && currentRates.studioKey) {
                  onStudioChange(currentRates.studioKey);
                }
                onNavigateTab('services');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-green)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              Full Price List <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Promos Banner Slider - Green Theme */}
      <div style={{
        background: 'linear-gradient(135deg, #142E1B 0%, #1F4529 100%)',
        borderRadius: '20px',
        padding: '16px',
        border: '1px solid rgba(39, 162, 67, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: '700', letterSpacing: '0.5px' }}>
            SPECIAL OFFER
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFF', margin: '2px 0' }}>
            Get 20% OFF First Pickup
          </div>
          <div style={{ fontSize: '12px', color: '#DCFCE7' }}>
            Use code <strong style={{ color: '#FDE047' }}>CLEANZ20</strong> at checkout
          </div>
        </div>

        <button 
          onClick={() => onNavigateTab('wallet')} 
          style={{
            background: '#FDE047',
            color: '#0B140D',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          Claim Now
        </button>
      </div>

      {/* ── Membership Packages ───────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '16px' }}>Membership Packages</h3>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Save more with every wash — choose your plan</div>
          </div>
          <span className="badge badge-green" style={{ fontSize: '10px' }}>Members Only</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Silver Saver */}
          <div style={{
            borderRadius: '20px',
            padding: '18px',
            background: 'linear-gradient(135deg, rgba(148,163,184,0.18) 0%, rgba(100,116,139,0.08) 100%)',
            border: '1.5px solid rgba(148,163,184,0.45)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '110px', height: '110px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(203,213,225,0.15) 0%, transparent 70%)'
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #94A3B8, #CBD5E1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(148,163,184,0.5)'
                }}>
                  <ShieldCheck size={22} color="#1E293B" />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Silver Saver</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Perfect for individuals</div>
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: '20px',
                background: 'rgba(148,163,184,0.2)', border: '1px solid rgba(148,163,184,0.5)',
                fontSize: '12px', fontWeight: '800', color: '#94A3B8'
              }}>15% OFF</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>₹1,999</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>/month</span>
              <span style={{
                marginLeft: '6px', fontSize: '11px', fontWeight: '700',
                color: '#94A3B8', textDecoration: 'line-through', opacity: 0.7
              }}>₹2,352</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
              {['15% off on all laundry services', 'Free pickup & delivery', 'Priority scheduling', 'Monthly billing, cancel anytime'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#94A3B8', fontWeight: '800', fontSize: '14px' }}>✓</span> {f}
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/919138004800?text=${encodeURIComponent('Hello Cleanz24, I want to subscribe to the Silver Saver membership plan (₹1,999/month, 15% off). Please share details.')}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px', borderRadius: '12px',
                background: 'rgba(148,163,184,0.15)', border: '1.5px solid rgba(148,163,184,0.5)',
                color: '#CBD5E1', fontSize: '13px', fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} /> Subscribe via WhatsApp
            </a>
          </div>

          {/* Gold Executive */}
          <div style={{
            borderRadius: '20px',
            padding: '18px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.16) 0%, rgba(217,119,6,0.06) 100%)',
            border: '1.5px solid rgba(245,158,11,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Most Popular ribbon */}
            <div style={{
              position: 'absolute', top: '12px', right: '-22px',
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
              color: '#FFF', fontSize: '9px', fontWeight: '800',
              padding: '3px 32px', transform: 'rotate(35deg)',
              letterSpacing: '0.5px'
            }}>POPULAR</div>
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)'
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(245,158,11,0.45)'
                }}>
                  <Award size={22} color="#78350F" />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Gold Executive</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>For families & power users</div>
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: '20px',
                background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.6)',
                fontSize: '12px', fontWeight: '800', color: '#F59E0B'
              }}>20% OFF</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>₹4,999</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>/month</span>
              <span style={{
                marginLeft: '6px', fontSize: '11px', fontWeight: '700',
                color: '#F59E0B', textDecoration: 'line-through', opacity: 0.7
              }}>₹6,249</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
              {['20% off on all laundry & dry-clean', 'Unlimited free pickups & deliveries', 'Express 24h turnaround included', 'Dedicated account manager', 'Family of 4 covered'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#F59E0B', fontWeight: '800', fontSize: '14px' }}>✓</span> {f}
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/919138004800?text=${encodeURIComponent('Hello Cleanz24, I want to subscribe to the Gold Executive membership plan (₹4,999/month, 20% off). Please share details.')}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '11px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#FFF', fontSize: '13px', fontWeight: '700',
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(245,158,11,0.35)'
              }}
            >
              <MessageCircle size={15} /> Subscribe via WhatsApp
            </a>
          </div>

          {/* Platinum Unlimited */}
          <div style={{
            borderRadius: '20px',
            padding: '18px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1.5px solid rgba(139,92,246,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '130px', height: '130px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)'
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8B5CF6, #C4B5FD)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(139,92,246,0.5)'
                }}>
                  <Crown size={22} color="#3B0764" />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>Platinum Unlimited</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>The ultimate laundry plan</div>
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: '20px',
                background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.6)',
                fontSize: '12px', fontWeight: '800', color: '#A78BFA'
              }}>25% OFF</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>₹9,999</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>/month</span>
              <span style={{
                marginLeft: '6px', fontSize: '11px', fontWeight: '700',
                color: '#A78BFA', textDecoration: 'line-through', opacity: 0.7
              }}>₹13,332</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
              {['25% off — highest savings guaranteed', 'Truly unlimited pickups & deliveries', 'Priority VIP queue — 12h express', 'Shoe & bag spa included free', 'Bulk corporate billing available', 'White-glove garment handling'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#8B5CF6', fontWeight: '800', fontSize: '14px' }}>✓</span> {f}
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/919138004800?text=${encodeURIComponent('Hello Cleanz24, I want to subscribe to the Platinum Unlimited membership plan (₹9,999/month, 25% off). Please share details.')}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '11px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                color: '#FFF', fontSize: '13px', fontWeight: '700',
                textDecoration: 'none', boxShadow: '0 4px 14px rgba(139,92,246,0.4)'
              }}
            >
              <MessageCircle size={15} /> Subscribe via WhatsApp
            </a>
          </div>

          {/* Compare note */}
          <div style={{
            textAlign: 'center', fontSize: '11px', color: 'var(--text-subtle)',
            padding: '4px 0 2px'
          }}>
            💬 WhatsApp <strong style={{ color: 'var(--primary-green)' }}>9138004800</strong> to activate your membership instantly
          </div>
        </div>
      </div>

      {/* Why Choose Cleanz24 */}
      <div>
        <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Why Customers Love Cleanz24</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: Clock, title: '24-Hour Express Turnaround', desc: 'Garments picked up today, fresh at your door tomorrow.' },
            { icon: ShieldCheck, title: 'German Eco-Friendly Solvents', desc: 'Gentle on fabrics, non-toxic, hypoallergenic detergent.' },
            { icon: Truck, title: 'Free Doorstep Pickup & Delivery', desc: 'Zero delivery fees on all orders above Rs. 300.' }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: 'rgba(39, 162, 67, 0.15)',
                  color: 'var(--primary-green)'
                }}>
                  <IconComp size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
