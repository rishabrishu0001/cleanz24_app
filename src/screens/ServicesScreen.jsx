import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingBag, MapPin, Phone, MessageCircle, Sparkles, ChevronDown, X, Navigation, Filter } from 'lucide-react';
import { getGarmentIcon } from '../utils/garmentIcons.js';
import { VAISHALI_CATALOG } from '../data/vaishaliCatalog.js';
import { BRAHMAPUR_CATALOG } from '../data/brahmapurCatalog.js';
import { JEYPORE_CATALOG } from '../data/jeyporeCatalog.js';
import { KOWKOOR_CATALOG } from '../data/kowkoorCatalog.js';
import { KAZHAKOOTAM_CATALOG } from '../data/kazhakootamCatalog.js';
import { KOKAPET_CATALOG } from '../data/kokapetCatalog.js';
import { SIWARA_CATALOG } from '../data/siwaraCatalog.js';
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

export default function ServicesScreen({ 
  cart, 
  setCart, 
  onProceedToBooking, 
  selectedStudio: propSelectedStudio, 
  onStudioChange,
  userLocation,
  userCoords,
  onOpenLocationPicker
}) {
  const [internalStudio, setInternalStudio] = useState(propSelectedStudio || 'noida41');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAudience, setActiveAudience] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize internal studio when parent propSelectedStudio changes
  useEffect(() => {
    if (propSelectedStudio) {
      setInternalStudio(propSelectedStudio);
    }
  }, [propSelectedStudio]);

  const selectedStudio = propSelectedStudio || internalStudio;
  const handleStudioChange = (key) => {
    setInternalStudio(key);
    if (onStudioChange) onStudioChange(key);
    setActiveCategory('all');
  };

  const studioConfig = {
    // Hyderabad Studios
    gachibowli: {
      key: 'gachibowli',
      name: 'Cleanz24 - Gachibowli Hyderabad',
      shortLabel: 'Gachibowli',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: GACHIBOWLI_CATALOG,
      desc: '377 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Premium Laundry ₹230, Suit 3 Pcs ₹499, Saree ₹199, Shoes ₹399',
      whatsapp: 'Hello Cleanz24 Gachibowli Hyderabad, I want to inquire about prices and book pickup.'
    },
    gopanpally: {
      key: 'gopanpally',
      name: 'Cleanz24 - Gopanpally Tellapur',
      shortLabel: 'Gopanpally',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: GOPANPALLY_CATALOG,
      desc: '486 verified rates: Wash & Fold ₹100/kg, Wash & Iron ₹130/kg, Hygiene Laundry ₹150, Suit 3 Pcs ₹499, Saree ₹199, Shoes ₹399',
      whatsapp: 'Hello Cleanz24 Gopanpally Hyderabad, I want to inquire about prices and book pickup.'
    },
    kokapet: {
      key: 'kokapet',
      name: 'Cleanz24 - Kokapet Hyderabad',
      shortLabel: 'Kokapet',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: KOKAPET_CATALOG,
      desc: '329 verified rates: Steam Iron (Baniean ₹15, Kurta ₹35), Dry Clean (Saree ₹199, Curtains ₹289), Laundry (Wash & Fold ₹100/kg)',
      whatsapp: 'Hello Cleanz24 Kokapet Hyderabad, I want to inquire about prices and book pickup.'
    },
    narsingi: {
      key: 'narsingi',
      name: 'Cleanz24 - Narsingi Hyderabad',
      shortLabel: 'Narsingi',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: NARSINGI_CATALOG,
      desc: '301 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹120/kg, Steam Iron Shirt ₹15, Bedsheet ₹120–₹160, Shoes ₹280–₹400',
      whatsapp: 'Hello Cleanz24 Narsingi Hyderabad, I want to inquire about prices and book pickup.'
    },
    kondapur: {
      key: 'kondapur',
      name: 'Cleanz24 - Kondapur Hyderabad',
      shortLabel: 'Kondapur',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: KONDAPUR_CATALOG,
      desc: '365 verified rates: Wash & Fold ₹100/kg, Wash & Steam Iron ₹130/kg, Hygiene Laundry ₹150, Saree Silk ₹279, Leather Jacket ₹599, Shoes ₹399',
      whatsapp: 'Hello Cleanz24 Kondapur Hyderabad, I want to inquire about prices and book pickup.'
    },
    beeramguda: {
      key: 'beeramguda',
      name: 'Cleanz24 - Beeramguda Sangareddy',
      shortLabel: 'Beeramguda',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: BEERAMGUDA_CATALOG,
      desc: '315 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Premium Laundry ₹169, Suit 3 Pcs ₹459–₹499, Saree ₹199, Shoes ₹349',
      whatsapp: 'Hello Cleanz24 Beeramguda Hyderabad, I want to inquire about prices and book pickup.'
    },
    kowkoor: {
      key: 'kowkoor',
      name: 'Cleanz24 - Kowkoor Secunderabad',
      shortLabel: 'Kowkoor',
      region: 'Hyderabad',
      city: 'Secunderabad',
      state: 'Telangana State Price List',
      catalog: KOWKOOR_CATALOG,
      desc: '464 verified rates: Wash & Fold ₹85/kg, Wash & Iron ₹130/kg, Suit 3 Pcs ₹459, Curtains ₹269, Silk Saree ₹249, Quilt ₹599',
      whatsapp: 'Hello Cleanz24 Kowkoor Secunderabad, I want to inquire about prices and book pickup.'
    },
    ibnagar: {
      key: 'ibnagar',
      name: 'Cleanz24 - Vanasthalipuram IB Nagar Hyderabad',
      shortLabel: 'IB Nagar (Vanasthalipuram)',
      region: 'Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana State Price List',
      catalog: IBNAGAR_CATALOG,
      desc: '576 verified rates: Wash & Fold ₹100/kg, Wash & Iron ₹130/kg, Premium Laundry Inners ₹150, Lehenga ₹350–₹900, Kurta Starch ₹80, Shoe Cleaning ₹350',
      whatsapp: 'Hello Cleanz24 IB Nagar Hyderabad, I want to inquire about prices and book pickup.'
    },

    // Noida / Delhi NCR Studios
    noida137: {
      key: 'noida137',
      name: 'Cleanz24 - Sector 137 Noida',
      shortLabel: 'Sector 137 Noida',
      region: 'Noida / NCR',
      city: 'Noida',
      state: 'Uttar Pradesh State Price List',
      catalog: NOIDA137_CATALOG,
      desc: '377 verified rates: Wash & Fold ₹90/kg, Wash & Steam Iron ₹120/kg, Gents Suit 3 Pcs ₹500, Saree ₹250, Leather Jacket ₹1,500, Blanket ₹350',
      whatsapp: 'Hello Cleanz24 Sector 137 Noida, I want to inquire about prices and book pickup.'
    },
    noida41: {
      key: 'noida41',
      name: 'Cleanz24 - Sector 41 Noida',
      shortLabel: 'Sector 41 Noida',
      region: 'Noida / NCR',
      city: 'Noida',
      state: 'Uttar Pradesh State Price List',
      catalog: NOIDA41_CATALOG,
      desc: '285 verified rates: Wash & Fold ₹80/kg, Wash & Steam Iron ₹110/kg, Suit 3 Pcs ₹499, Saree ₹199, Leather Jacket ₹700, Shoes ₹349',
      whatsapp: 'Hello Cleanz24 Sector 41 Noida, I want to inquire about prices and book pickup.'
    },
    vaishali: {
      key: 'vaishali',
      name: 'Cleanz24 - Vaishali Ghaziabad',
      shortLabel: 'Vaishali Ghaziabad',
      region: 'Noida / NCR',
      city: 'Ghaziabad',
      state: 'Uttar Pradesh State Price List',
      catalog: VAISHALI_CATALOG,
      desc: '418 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Suit 3 Pcs ₹499, Saree Silk ₹399, Shirt with Charak ₹189, Quilt Double ₹549',
      whatsapp: 'Hello Cleanz24 Vaishali Ghaziabad, I want to inquire about prices and book pickup.'
    },
    niralaestate: {
      key: 'niralaestate',
      name: 'Cleanz24 - Nirala Estate Greater Noida West',
      shortLabel: 'Nirala Estate (Gr. Noida W)',
      region: 'Noida / NCR',
      city: 'Greater Noida West',
      state: 'Uttar Pradesh State Price List',
      catalog: NIRALA_ESTATE_CATALOG,
      desc: '280 verified rates: Wash & Fold ₹80/kg, Wash & Steam Iron ₹110/kg, Premium Laundry ₹169/kg, Woolen Laundry ₹239/kg, Suit 2 Pcs ₹379, Saree ₹199',
      whatsapp: 'Hello Cleanz24 Nirala Estate Greater Noida West, I want to inquire about prices and book pickup.'
    },

    // Uttarakhand Studio
    roorkee: {
      key: 'roorkee',
      name: 'Cleanz24 - Roorkee Haridwar',
      shortLabel: 'Roorkee',
      region: 'Uttarakhand',
      city: 'Roorkee',
      state: 'Uttarakhand State Price List',
      catalog: ROORKEE_CATALOG,
      desc: '263 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Woolen Laundry ₹239, Premium Laundry ₹169, Quilt ₹199, Saree ₹199, Blazer ₹299, Shoes ₹349–₹449',
      whatsapp: 'Hello Cleanz24 Roorkee Uttarakhand, I want to inquire about prices and book pickup.'
    },

    // Rajasthan Studios
    sanchore: {
      key: 'sanchore',
      name: 'Cleanz24 - Sanchore',
      shortLabel: 'Sanchore',
      region: 'Rajasthan',
      city: 'Sanchore',
      state: 'Rajasthan State Price List',
      catalog: SANCHORE_CATALOG,
      desc: '471 verified rates: Wash & Fold ₹70/kg, Wash & Iron ₹100/kg, Premium Laundry ₹170, Suit 3 Pcs ₹379, Saree ₹199, Shoes ₹249',
      whatsapp: 'Hello Cleanz24 Sanchore, I want to inquire about prices and book pickup.'
    },
    bhilwara: {
      key: 'bhilwara',
      name: 'Cleanz24 - Bhilwara',
      shortLabel: 'Bhilwara',
      region: 'Rajasthan',
      city: 'Bhilwara',
      state: 'Rajasthan State Price List',
      catalog: BHILWARA_CATALOG,
      desc: '452 verified rates: Wash & Fold ₹70/kg, Wash & Steam Iron ₹100/kg, Suit 3 Pcs ₹329, Rajputi Poshak ₹499, Blanket ₹249, Shoes ₹249',
      whatsapp: 'Hello Cleanz24 Bhilwara Rajasthan, I want to inquire about prices and book pickup.'
    },
    siwara: {
      key: 'siwara',
      name: 'Cleanz24 - Main Market Siwara',
      shortLabel: 'Siwara',
      region: 'Rajasthan',
      city: 'Siwara',
      state: 'Rajasthan State Price List',
      catalog: SIWARA_CATALOG,
      desc: '265 verified rates: Steam Iron (Shirt ₹20), Dry Clean (Saree ₹199, Ghagra ₹149), Laundry (Wash & Fold ₹70/kg)',
      whatsapp: 'Hello Cleanz24 Siwara Rajasthan, I want to inquire about prices and book pickup.'
    },
    udaipur: {
      key: 'udaipur',
      name: 'Cleanz24 - Udaipur Rajasthan',
      shortLabel: 'Udaipur (Panchwati)',
      region: 'Rajasthan',
      city: 'Udaipur',
      state: 'Rajasthan State Price List',
      catalog: UDAIPUR_CATALOG,
      desc: '595 verified rates: Wash & Fold ₹70/kg, Wash & Iron ₹100/kg, Premium Laundry ₹170/kg, Woolen ₹220/kg, Rajputi Poshak ₹399–₹599, Saafa ₹30–₹99, Shoes ₹149–₹699',
      whatsapp: 'Hello Cleanz24 Udaipur Rajasthan, I want to inquire about prices and book pickup.'
    },

    // Odisha Studios
    cuttack: {
      key: 'cuttack',
      name: 'Cleanz24 - CDA Cuttack',
      shortLabel: 'CDA Cuttack',
      region: 'Odisha',
      city: 'Cuttack',
      state: 'Odisha State Price List',
      catalog: CUTTACK_CATALOG,
      desc: '315 verified rates: Wash & Fold ₹70/kg, Wash & Iron ₹100/kg, Premium Laundry ₹150, Suit 3 Pcs ₹369, Saree ₹199, Shoes ₹249',
      whatsapp: 'Hello Cleanz24 CDA Cuttack, I want to inquire about prices and book pickup.'
    },
    oldtown: {
      key: 'oldtown',
      name: 'Cleanz24 - Old Town Bhubaneswar',
      shortLabel: 'Old Town Bhubaneswar',
      region: 'Odisha',
      city: 'Bhubaneswar',
      state: 'Odisha State Price List',
      catalog: OLDTOWN_CATALOG,
      desc: '310 verified rates: Wash & Fold ₹75/kg (₹20/pc), Wash & Steam Iron ₹100/kg, Suit 3 Pcs ₹379, Saree ₹149, Blanket ₹299, Shoes ₹249',
      whatsapp: 'Hello Cleanz24 Old Town Bhubaneswar, I want to inquire about prices and book pickup.'
    },
    brahmapur: {
      key: 'brahmapur',
      name: 'Cleanz24 - Brahmapur (Berhampur)',
      shortLabel: 'Brahmapur',
      region: 'Odisha',
      city: 'Brahmapur',
      state: 'Odisha State Price List',
      catalog: BRAHMAPUR_CATALOG,
      desc: '528 verified rates: Wash & Fold ₹70/kg, Wash & Steam Iron ₹100/kg, Suit 3 Pcs ₹349, Saree ₹150, Blanket ₹230, Shoes ₹249',
      whatsapp: 'Hello Cleanz24 Brahmapur Odisha, I want to inquire about prices and book pickup.'
    },
    jeypore: {
      key: 'jeypore',
      name: 'Cleanz24 - Jeypore',
      shortLabel: 'Jeypore',
      region: 'Odisha',
      city: 'Jeypore',
      state: 'Odisha State Price List',
      catalog: JEYPORE_CATALOG,
      desc: '349 verified rates: Wash & Fold ₹70/kg (₹20/pc), Wash & Steam Iron ₹100/kg, Double Blanket ₹150, Suit ₹289, Saree ₹149',
      whatsapp: 'Hello Cleanz24 Jeypore Odisha, I want to inquire about prices and book pickup.'
    },
    jatni: {
      key: 'jatni',
      name: 'Cleanz24 - Jatni Khordha Odisha',
      shortLabel: 'Jatni (Khordha)',
      region: 'Odisha',
      city: 'Jatni',
      state: 'Odisha State Price List',
      catalog: JATNI_CATALOG,
      desc: '544 verified rates: Wash & Fold ₹70/kg, Wash & Iron ₹100/kg, Suit 2 Pcs ₹289, Saree ₹149–₹499, Blanket ₹299–₹399, Shoes ₹199–₹399',
      whatsapp: 'Hello Cleanz24 Jatni Khordha Odisha, I want to inquire about prices and book pickup.'
    },
    angul: {
      key: 'angul',
      name: 'Cleanz24 - Angul Odisha',
      shortLabel: 'Angul (Odisha)',
      region: 'Odisha',
      city: 'Angul',
      state: 'Odisha State Price List',
      catalog: ANGUL_CATALOG,
      desc: '390 verified rates: Wash & Fold ₹80/kg (₹20/pc), Wash & Iron ₹110/kg (₹40/pc), Suit 3 Pcs ₹90 (Steam), Saree ₹149–₹249, Blanket ₹199–₹399, Shoes ₹99–₹600',
      whatsapp: 'Hello Cleanz24 Angul Odisha, I want to inquire about prices and book pickup.'
    },
    palasuni: {
      key: 'palasuni',
      name: 'Cleanz24 - Palasuni Bhubaneswar Odisha',
      shortLabel: 'Palasuni (BBSR)',
      region: 'Odisha',
      city: 'Bhubaneswar',
      state: 'Odisha State Price List',
      catalog: PALASUNI_CATALOG,
      desc: '530 verified rates: Wash & Fold ₹80/kg (₹20/pc), Wash & Iron ₹110/kg (₹30/pc), Suit 3 Pcs ₹90 (Steam) / ₹379 (DC), Saree ₹50–₹150 (Steam) / ₹199–₹350 (DC), Shoes ₹89–₹399',
      whatsapp: 'Hello Cleanz24 Palasuni Bhubaneswar Odisha, I want to inquire about prices and book pickup.'
    },

    // Maharashtra Studio
    alibag: {
      key: 'alibag',
      name: 'Cleanz24 - Alibag',
      shortLabel: 'Alibag (Raigad)',
      region: 'Maharashtra',
      city: 'Alibag',
      state: 'Maharashtra State Price List',
      catalog: ALIBAG_CATALOG,
      desc: '406 verified rates: Wash & Fold ₹120/kg, Wash & Iron ₹140/kg, Premium Laundry ₹169, Suit 3 Pcs ₹399, Saree ₹189–₹329, Shoes ₹319',
      whatsapp: 'Hello Cleanz24 Alibag, I want to inquire about prices and book pickup.'
    },
    thane: {
      key: 'thane',
      name: 'Cleanz24 - Thane West',
      shortLabel: 'Thane West',
      region: 'Maharashtra',
      city: 'Thane West',
      state: 'Maharashtra State Price List',
      catalog: THANE_CATALOG,
      desc: '555 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Premium Laundry ₹170/kg, Suit 2 Pcs ₹399, Saree ₹199, Backpack ₹549',
      whatsapp: 'Hello Cleanz24 Thane West, I want to inquire about prices and book pickup.'
    },

    // Madhya Pradesh Studio
    bhopal: {
      key: 'bhopal',
      name: 'Cleanz24 - Bhopal',
      shortLabel: 'Bhopal (MP)',
      region: 'Bhopal',
      city: 'Bhopal',
      state: 'Madhya Pradesh State Price List',
      catalog: BHOPAL_CATALOG,
      desc: '391 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Premium Laundry ₹150, Suit 3 Pcs ₹379, Saree ₹199, Shoes ₹249',
      whatsapp: 'Hello Cleanz24 Bhopal, I want to inquire about prices and book pickup.'
    },

    // Kerala Studios
    kazhakootam: {
      key: 'kazhakootam',
      name: 'Cleanz24 - Kazhakkoottam Trivandrum',
      shortLabel: 'Kazhakkoottam',
      region: 'Kerala',
      city: 'Trivandrum',
      state: 'Kerala State Price List',
      catalog: KAZHAKOOTAM_CATALOG,
      desc: '262 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Kerala Saree ₹149, Kancheepuram Silk ₹449, Suit Set ₹498, Dhoti ₹79',
      whatsapp: 'Hello Cleanz24 Kazhakkoottam Trivandrum, I want to inquire about prices and book pickup.'
    },
    thampanoor: {
      key: 'thampanoor',
      name: 'Cleanz24 - Thampanoor Trivandrum',
      shortLabel: 'Thampanoor',
      region: 'Kerala',
      city: 'Trivandrum',
      state: 'Kerala State Price List',
      catalog: THAMPANOOR_CATALOG,
      desc: '305 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Kerala Saree ₹149, Kancheepuram Silk ₹449, Suit Set ₹498, Dhoti Starch ₹89',
      whatsapp: 'Hello Cleanz24 Thampanoor Trivandrum, I want to inquire about prices and book pickup.'
    },
    parad: {
      key: 'parad',
      name: 'Cleanz24 - Parad Parat Kerala',
      shortLabel: 'Parad (Kannur)',
      region: 'Kerala',
      city: 'Parad',
      state: 'Kerala State Price List',
      catalog: PARAD_CATALOG,
      desc: '548 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Suit 3 Pcs ₹90 (Steam) / ₹389 (DC), Saree ₹50–₹150 (Steam) / ₹249–₹479 (DC), Shoes ₹119–₹1099',
      whatsapp: 'Hello Cleanz24 Parad Parat Kerala, I want to inquire about prices and book pickup.'
    },

    // Puducherry Studio
    mahe: {
      key: 'mahe',
      name: 'Cleanz24 - Mahe Puducherry',
      shortLabel: 'Mahe (Puducherry)',
      region: 'Puducherry',
      city: 'Mahe',
      state: 'Puducherry State Price List',
      catalog: MAHE_CATALOG,
      desc: '545 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Suit 3 Pcs ₹90 (Steam) / ₹389 (DC), Saree ₹50–₹150 (Steam) / ₹249–₹479 (DC), Shoes ₹119–₹1099',
      whatsapp: 'Hello Cleanz24 Mahe Puducherry, I want to inquire about prices and book pickup.'
    },

    // Punjab Studio
    amritsar: {
      key: 'amritsar',
      name: 'Cleanz24 - Amritsar Punjab',
      shortLabel: 'Amritsar',
      region: 'Punjab',
      city: 'Amritsar',
      state: 'Punjab State Price List',
      catalog: AMRITSAR_CATALOG,
      desc: '295 verified rates: Wash & Fold ₹88/kg, Wash & Steam Iron ₹121/kg, Premium Laundry ₹179, Turban ₹58, Kurta Pyjama Starch ₹198, Guru Granth Sahib Rumala ₹149–₹249',
      whatsapp: 'Hello Cleanz24 Amritsar Punjab, I want to inquire about prices and book pickup.'
    },

    // Bihar Studio
    purnia: {
      key: 'purnia',
      name: 'Cleanz24 - Purnia Bihar',
      shortLabel: 'Purnia (Bihar)',
      region: 'Bihar',
      city: 'Purnia',
      state: 'Bihar State Price List',
      catalog: PURNIA_CATALOG,
      desc: '563 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Premium Laundry ₹149, Suit 2 Pcs ₹249, Saree ₹129–₹299, Shoes ₹200–₹350',
      whatsapp: 'Hello Cleanz24 Purnia Bihar, I want to inquire about prices and book pickup.'
    },

    // Gujarat Studio
    nadiad: {
      key: 'nadiad',
      name: 'Cleanz24 - Nadiad Gujarat',
      shortLabel: 'Nadiad (Gujarat)',
      region: 'Gujarat',
      city: 'Nadiad',
      state: 'Gujarat State Price List',
      catalog: NADIAD_CATALOG,
      desc: '229 verified rates: Wash & Fold ₹80/kg, Wash & Iron ₹110/kg, Suit 3 Pcs ₹199, Saree ₹149, Blazer ₹299, Shoes ₹249–₹399',
      whatsapp: 'Hello Cleanz24 Nadiad Gujarat, I want to inquire about prices and book pickup.'
    },

    // West Bengal Studio
    siliguri: {
      key: 'siliguri',
      name: 'Cleanz24 - Siliguri West Bengal',
      shortLabel: 'Siliguri (WB)',
      region: 'West Bengal',
      city: 'Siliguri',
      state: 'West Bengal State Price List',
      catalog: SILIGURI_CATALOG,
      desc: '564 verified rates: Wash & Fold ₹80/kg (₹20/pc), Wash & Iron ₹110/kg (₹30/pc), Premium Laundry ₹160/kg, Suit 3 Pcs ₹329, Saree ₹129–₹299, Shoes ₹249–₹599',
      whatsapp: 'Hello Cleanz24 Siliguri West Bengal, I want to inquire about prices and book pickup.'
    },

    // Punjab Studio - Kharar
    kharar: {
      key: 'kharar',
      name: 'Cleanz24 - Kharar Punjab',
      shortLabel: 'Kharar (Punjab)',
      region: 'Punjab',
      city: 'Kharar',
      state: 'Punjab State Price List',
      catalog: KHARAR_CATALOG,
      desc: '329 verified rates: Wash & Fold ₹80/kg (₹20/pc), Wash & Steam Iron ₹110/kg, Premium Laundry ₹169/kg, Woolen ₹239/kg, Suit 3 Pcs ₹400, Saree ₹199, Turban ₹49',
      whatsapp: 'Hello Cleanz24 Kharar Punjab, I want to inquire about prices and book pickup.'
    },
    patiala: {
      key: 'patiala',
      name: 'Cleanz24 - Patiala Punjab',
      shortLabel: 'Patiala (Punjab)',
      region: 'Punjab',
      city: 'Patiala',
      state: 'Punjab State Price List',
      catalog: PATIALA_CATALOG,
      desc: '310 verified rates: Wash & Fold ₹80/kg, Wash & Steam Iron ₹110/kg, Premium Laundry ₹169/kg, Woolen ₹239/kg, Suit 3 Pcs ₹149 (Steam) / ₹499 (DC), Saree ₹100–₹175 (Steam) / ₹199–₹479 (DC), Shoes ₹119–₹1099',
      whatsapp: 'Hello Cleanz24 Patiala Punjab, I want to inquire about prices and book pickup.'
    }
  };

  const [selectedCity, setSelectedCity] = useState('all');
  const [showStorePickerModal, setShowStorePickerModal] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');

  const filteredStudios = useMemo(() => {
    return Object.values(studioConfig).filter(s => {
      if (selectedCity === 'all') return true;
      return s.region === selectedCity;
    });
  }, [selectedCity]);

  const modalFilteredStudios = useMemo(() => {
    const q = storeSearch.trim().toLowerCase();
    return Object.values(studioConfig).filter(s => {
      if (!q) return true;
      return s.name.toLowerCase().includes(q) ||
             s.shortLabel.toLowerCase().includes(q) ||
             s.region.toLowerCase().includes(q) ||
             s.state.toLowerCase().includes(q) ||
             (s.city && s.city.toLowerCase().includes(q));
    });
  }, [storeSearch]);

  const currentStudio = studioConfig[selectedStudio] || studioConfig.vaishali;
  const catalogItems = currentStudio.catalog;

  // Filtering
  const filteredItems = catalogItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.serviceKey === activeCategory;
    const matchesAudience = activeAudience === 'all' || 
      (activeAudience === 'men' && item.audience.toLowerCase().includes('men')) ||
      (activeAudience === 'women' && item.audience.toLowerCase().includes('women')) ||
      (activeAudience === 'kids' && item.audience.toLowerCase().includes('kid')) ||
      (activeAudience === 'household' && (item.audience.toLowerCase().includes('house') || item.audience.toLowerCase().includes('institution')));
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.name.toLowerCase().includes(q) || 
      item.service.toLowerCase().includes(q) ||
      item.audience.toLowerCase().includes(q);

    return matchesCategory && matchesAudience && matchesSearch;
  });

  // Cart Helper functions
  const getItemQty = (id) => cart[id]?.quantity || 0;

  const updateQuantity = (item, delta) => {
    const currentQty = getItemQty(item.id);
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      const nextCart = { ...cart };
      delete nextCart[item.id];
      setCart(nextCart);
    } else {
      setCart({
        ...cart,
        [item.id]: {
          ...item,
          quantity: newQty
        }
      });
    }
  };

  // Cart Summary calculations
  const cartItemCount = Object.values(cart).reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = Object.values(cart).reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <div className="animate-fade-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Active Studio Header Bar with Change Button */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'linear-gradient(135deg, rgba(60, 139, 53, 0.12) 0%, rgba(39, 162, 67, 0.05) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(39, 162, 67, 0.35)',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(60, 139, 53, 0.2), rgba(39, 162, 67, 0.1))', 
            border: '1px solid rgba(39, 162, 67, 0.3)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--primary-green)',
            flexShrink: 0
          }}>
            <MapPin size={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
              <span>📍 Serving Studio Rates</span>
              {userLocation && (
                <span style={{ color: 'var(--text-muted)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                  • {userLocation}
                </span>
              )}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentStudio.name}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-subtle)', marginTop: '2px' }}>
              {catalogItems.length} verified item rates loaded
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowStorePickerModal(true)}
          className="interactive"
          style={{
            padding: '8px 12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3C8B35, #27A243)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '11.5px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(39, 162, 67, 0.25)'
          }}
        >
          Change Studio ▾
        </button>
      </div>

      {/* City Filter Tabs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filter by City / Region:
          </span>
          <button
            onClick={() => setShowStorePickerModal(true)}
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
            <Search size={12} /> Search All Stores
          </button>
        </div>
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { id: 'all', label: 'All Cities (37)' },
            { id: 'Punjab', label: 'Punjab (3)' },
            { id: 'West Bengal', label: 'Siliguri WB' },
            { id: 'Gujarat', label: 'Gujarat (1)' },
            { id: 'Hyderabad', label: 'Hyderabad (8)' },
            { id: 'Noida / NCR', label: 'Noida / NCR (4)' },
            { id: 'Uttarakhand', label: 'Roorkee (1)' },
            { id: 'Rajasthan', label: 'Rajasthan (4)' },
            { id: 'Odisha', label: 'Odisha (7)' },
            { id: 'Maharashtra', label: 'Maharashtra (2)' },
            { id: 'Bihar', label: 'Bihar' },
            { id: 'Bhopal', label: 'Bhopal MP' },
            { id: 'Kerala', label: 'Kerala (3)' },
            { id: 'Puducherry', label: 'Mahe Puducherry' }
          ].map(city => {
            const isActive = selectedCity === city.id;
            return (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? '800' : '600',
                  whiteSpace: 'nowrap',
                  border: isActive ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                  background: isActive ? 'rgba(39, 162, 67, 0.18)' : 'var(--bg-card)',
                  color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Studio Location Selector — Filtered Pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {filteredStudios.map((studio) => {
          const isActive = selectedStudio === studio.key;
          return (
            <button
              key={studio.key}
              onClick={() => handleStudioChange(studio.key)}
              style={{
                padding: '7px 12px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                border: isActive ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
                background: isActive ? 'linear-gradient(135deg, #3C8B35, #27A243)' : 'var(--bg-card-subtle)',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: isActive ? '0 3px 10px rgba(39, 162, 67, 0.3)' : 'none'
              }}
            >
              <MapPin size={12} />
              {studio.shortLabel}
              <span style={{ fontSize: '10px', opacity: isActive ? 0.9 : 0.6, marginLeft: '2px' }}>
                ({studio.region})
              </span>
            </button>
          );
        })}
      </div>

      {/* Studio Header Card */}
      <div 
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(60, 139, 53, 0.16) 0%, rgba(39, 162, 67, 0.06) 100%)',
          border: '1px solid var(--border-active)',
          padding: '14px 16px',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="badge badge-green" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} /> {currentStudio.name}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {currentStudio.state}
          </span>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
          {currentStudio.name.replace('Cleanz24 - ', '')} Official Price List
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
          {currentStudio.desc}
        </p>

        {/* Quick Contact buttons for Selected Studio */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <a
            href="tel:+919138004800"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <Phone size={13} color="var(--primary-green)" /> Call: 9138004800
          </a>
          <a
            href={`https://wa.me/919138004800?text=${encodeURIComponent(currentStudio.whatsapp)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(37,211,102,0.18)',
              border: '1px solid rgba(37,211,102,0.4)',
              color: '#16A34A',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <MessageCircle size={13} /> WhatsApp Studio
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
        <input 
          type="text" 
          placeholder={`Search ${catalogItems.length}+ garments (e.g. saree, suit, lehenga, quilt)...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 38px',
            borderRadius: '14px',
            border: '1px solid var(--border-glass)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Service Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: 'All (265)' },
          { id: 'dry_clean', label: 'Dry Clean (122)' },
          { id: 'steam_iron', label: 'Steam Iron (126)' },
          { id: 'laundry', label: 'Laundry Per Kg' },
          { id: 'shoe_care', label: 'Shoe Spa' },
          { id: 'accessories', label: 'Accessories & Bags' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              border: activeCategory === cat.id ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
              background: activeCategory === cat.id ? 'rgba(39, 162, 67, 0.2)' : 'var(--bg-card)',
              color: activeCategory === cat.id ? 'var(--primary-green)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Audience Sub-Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'all', label: 'All Items' },
          { id: 'men', label: '👔 Men' },
          { id: 'women', label: '👗 Women' },
          { id: 'kids', label: '🧒 Kids' },
          { id: 'household', label: '🏠 Household & Drapes' }
        ].map(aud => (
          <button
            key={aud.id}
            onClick={() => setActiveAudience(aud.id)}
            style={{
              padding: '5px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              border: activeAudience === aud.id ? '1px solid var(--primary-green)' : '1px solid var(--border-glass)',
              background: activeAudience === aud.id ? 'rgba(39, 162, 67, 0.15)' : 'transparent',
              color: activeAudience === aud.id ? 'var(--primary-green)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {aud.label}
          </button>
        ))}
      </div>

      {/* Catalog Items Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No garments matching "{searchQuery}". Try searching for suits, shirts, or sneakers!
          </div>
        ) : (
          filteredItems.map(item => {
            const qty = getItemQty(item.id);
            const icon = getGarmentIcon(item);

            return (
              <div 
                key={item.id} 
                className="glass-card" 
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  border: qty > 0 ? '1px solid var(--border-active)' : '1px solid var(--border-glass)',
                  background: qty > 0 ? 'rgba(39, 162, 67, 0.08)' : 'var(--bg-card)'
                }}
              >
                {/* Item Icon Thumbnail */}
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  background: icon.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ fontSize: '32px', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                    {icon.emoji}
                  </span>
                  {item.tag && (
                    <span style={{
                      position: 'absolute',
                      bottom: '3px',
                      left: '3px',
                      right: '3px',
                      background: 'rgba(0,0,0,0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '7px',
                      fontWeight: '700',
                      padding: '2px 3px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '0.02em'
                    }}>
                      {item.service}
                    </span>
                  )}
                </div>

                {/* Info & Counter */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', lineHeight: '1.2' }}>{item.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                        Rs. {item.price}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '2px' }}>
                        {item.unit}
                      </span>
                    </div>

                    {/* Quantity Add / Remove Controls */}
                    {qty === 0 ? (
                      <button 
                        onClick={() => updateQuantity(item, 1)}
                        style={{
                          background: 'rgba(39, 162, 67, 0.18)',
                          color: 'var(--primary-green)',
                          border: '1px solid rgba(39, 162, 67, 0.45)',
                          borderRadius: '10px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(39, 162, 67, 0.25)',
                        border: '1px solid var(--primary-green)',
                        borderRadius: '10px',
                        padding: '2px 6px'
                      }}>
                        <button 
                          onClick={() => updateQuantity(item, -1)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-green)', cursor: 'pointer', padding: '4px' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFF', minWidth: '16px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item, 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-green)', cursor: 'pointer', padding: '4px' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Sticky Cart Bar */}
      {cartItemCount > 0 && (
        <div className="floating-cart-bar animate-fade-in">
          <div>
            <div style={{ fontSize: '11px', color: '#A7F3D0' }}>
              {cartItemCount} {cartItemCount === 1 ? 'Garment Item' : 'Garment Items'} Selected
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFF' }}>
              Rs. {cartSubtotal}
            </div>
          </div>

          <button className="btn-primary" onClick={onProceedToBooking} style={{ width: 'auto', padding: '10px 18px', fontSize: '14px' }}>
            Book Pickup <ShoppingBag size={16} />
          </button>
        </div>
      )}

      {/* Store Picker Modal */}
      {showStorePickerModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '24px 24px 0 0',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>Select Nearest Studio</h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Pick your studio to view exact local prices & book pickup
                </div>
              </div>
              <button
                onClick={() => setShowStorePickerModal(false)}
                style={{
                  background: 'var(--bg-card-subtle)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar inside Modal */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-glass)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-card-subtle)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)'
              }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search city, area, store (e.g. Hyderabad, Noida, Sanchore)..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-main)',
                    width: '100%',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                {storeSearch && (
                  <button onClick={() => setStoreSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Modal Store List */}
            <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {modalFilteredStudios.map(studio => {
                const isCurrent = selectedStudio === studio.key;
                return (
                  <div
                    key={studio.key}
                    onClick={() => {
                      handleStudioChange(studio.key);
                      setShowStorePickerModal(false);
                    }}
                    className="interactive"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: isCurrent ? '1.5px solid var(--primary-green)' : '1px solid var(--border-glass)',
                      background: isCurrent ? 'rgba(39, 162, 67, 0.12)' : 'var(--bg-card-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: isCurrent ? 'var(--primary-green)' : 'var(--text-main)' }}>
                          {studio.name.replace('Cleanz24 - ', '')}
                        </span>
                        <span className="badge badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>
                          {studio.region}
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {studio.state}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                        {studio.desc.split(':')[0]} verified rates
                      </div>
                    </div>

                    <button
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: isCurrent ? 'var(--primary-green)' : 'transparent',
                        color: isCurrent ? '#FFF' : 'var(--primary-green)',
                        border: isCurrent ? 'none' : '1px solid var(--primary-green)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isCurrent ? 'Selected ✓' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
