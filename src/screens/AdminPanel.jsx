import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Store, Package, Users, TrendingUp,
  DollarSign, MapPin, Plus, Pencil, Trash2, CheckCircle2,
  Clock, Truck, Check, X, Search, Filter, Phone, MessageCircle,
  ChevronRight, ArrowUpRight, BarChart3, Tag, Sparkles, Building2,
  Lock, Eye, AlertCircle, RefreshCw, Smartphone, Sun, Moon
} from 'lucide-react';
import initialStoresData from '../data/stores.json';
import api from '../services/api.js';
import { getRealCatalogForStore } from '../services/storeCatalogs.js';

// ── Default Standard Price List Template for Franchise Studios ───────────────
export const DEFAULT_STUDIO_PRICE_ITEMS = [
  { id: 'p_1', name: 'Standard Wash & Fold', service: 'Wash & Fold', serviceKey: 'wash_fold', category: 'wash_fold', audience: 'Household', price: 49, unit: '/ kg', desc: 'Hygiene eco-wash and tumble fold' },
  { id: 'p_2', name: 'Steam Press - Formal Shirt', service: 'Steam Press', serviceKey: 'steam_iron', category: 'steam_iron', audience: 'Men', price: 29, unit: '/ pc', desc: 'Italian boiler finish with wrinkle-free collar' },
  { id: 'p_3', name: 'Steam Press - Trousers / Jeans', service: 'Steam Press', serviceKey: 'steam_iron', category: 'steam_iron', audience: 'Men', price: 45, unit: '/ pc', desc: 'Sharp crease vacuum suction press' },
  { id: 'p_4', name: '2-Piece Men / Women Suit', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Men', price: 399, unit: '/ suit', desc: 'Gentle hydrocarbon organic dry cleaning' },
  { id: 'p_5', name: 'Silk / Designer Saree Care', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Women', price: 299, unit: '/ saree', desc: 'Delicate fabric care with roll polish & charak' },
  { id: 'p_6', name: 'Heavy Winter Blanket / Quilt', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Household', price: 399, unit: '/ item', desc: 'Anti-bacterial allergen wash' },
  { id: 'p_7', name: 'Premium Kurta / Sherwani', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Men', price: 249, unit: '/ pc', desc: 'Festive & ethnic fabric rejuvenation' },
  { id: 'p_8', name: 'Sneakers & Leather Shoe Spa', service: 'Shoe Spa', serviceKey: 'shoe_spa', category: 'shoe_spa', audience: 'Men', price: 349, unit: '/ pair', desc: 'Deep sole & upper cleansing + deodorizing' },
  { id: 'p_9', name: 'Blackout Window Curtains', service: 'Dry Clean', serviceKey: 'dry_clean', category: 'dry_clean', audience: 'Household', price: 149, unit: '/ panel', desc: 'Dust & stain extraction dry cleaning' }
];

export default function AdminPanel({ onExitToApp, darkMode = true, setDarkMode, initialAuthenticated = true }) {
  // ── Authentication & Security Gate State ────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPinMask, setShowPinMask] = useState(false);

  // ── Scoped Studio Filter State ────────────────────────────────────────
  const [selectedStudio, setSelectedStudio] = useState('All Stores');
  const [activeTab, setActiveTab] = useState('overview'); // overview | orders | stores | franchise | pricing | fleet

  // ── Credentials / PIN Database ─────────────────────────────────────────────
  const MASTER_PASSWORDS = ['9999', 'CLEANZ@HQ2026', 'admin999', 'Cleanz24@1212'];

  // Handle PIN Login Verification
  const handleVerifyLogin = (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    if (MASTER_PASSWORDS.includes(enteredPin) || enteredPin === '9999') {
      setIsAuthenticated(true);
      setEnteredPin('');
    } else {
      setAuthError('❌ Invalid Admin Passcode! (Default: 9999)');
    }
  };

  // Instant 1-Tap Unlock Helper
  const handleInstantUnlock = () => {
    setAuthError('');
    setIsAuthenticated(true);
    setEnteredPin('');
  };

  // Handle On-Screen Keypad Tap
  const handleKeypadPress = (val) => {
    setAuthError('');
    if (val === 'clear') {
      setEnteredPin('');
    } else if (val === 'backspace') {
      setEnteredPin(prev => prev.slice(0, -1));
    } else {
      if (enteredPin.length < 6) {
        const nextPin = enteredPin + val;
        setEnteredPin(nextPin);
        // Auto submit if 4 digits
        if (nextPin.length === 4) {
          if (MASTER_PASSWORDS.includes(nextPin) || nextPin === '9999') {
            setIsAuthenticated(true);
            setEnteredPin('');
          }
        }
      }
    }
  };

  // Handle Logout / Lock Terminal
  const handleLockTerminal = () => {
    setIsAuthenticated(false);
    setEnteredPin('');
    setAuthError('');
  };

  // ── Stores State (CRUD & Price Lists) ──────────────────────────────────────
  const [storesList, setStoresList] = useState(initialStoresData);
  const [storeSearch, setStoreSearch] = useState('');
  const [editingStore, setEditingStore] = useState(null);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [isDeletingStore, setIsDeletingStore] = useState(false);
  const [isSubmittingStore, setIsSubmittingStore] = useState(false);
  const [storeActionMsg, setStoreActionMsg] = useState('');
  const [storeFormData, setStoreFormData] = useState({
    name: '', address: '', city: 'Noida', state: 'Uttar Pradesh',
    phone: '9138004800', whatsapp: '919138004800', rating: 4.8, reviews: 10,
    lat: 28.5445, lng: 77.3292, openingTime: '08:00 AM - 09:00 PM',
    status: 'Active', tags: 'Dry Cleaning, Wash & Fold, Steam Press',
    priceList: JSON.parse(JSON.stringify(DEFAULT_STUDIO_PRICE_ITEMS))
  });

  // ── Studio Price List Management Modal State ──────────────────────────────
  const [selectedStoreForPriceList, setSelectedStoreForPriceList] = useState(null);
  const [priceListItems, setPriceListItems] = useState([]);
  const [isSavingPriceList, setIsSavingPriceList] = useState(false);
  const [priceListSearch, setPriceListSearch] = useState('');
  const [priceListFilterCategory, setPriceListFilterCategory] = useState('all');
  const [showNewPriceItemForm, setShowNewPriceItemForm] = useState(false);
  const [newPriceItemInput, setNewPriceItemInput] = useState({
    name: '', service: 'Dry Clean', price: 199, unit: '/ pc', audience: 'Men'
  });
  const [showModalPriceListEditor, setShowModalPriceListEditor] = useState(false);
  const [showAddCustomPriceItem, setShowAddCustomPriceItem] = useState(false);
  const [newCustomPriceDraft, setNewCustomPriceDraft] = useState({
    name: '', service: 'Dry Clean', price: 249, unit: '/ pc'
  });

  // ── Orders State (CRUD & Status Stepper) ────────────────────────────────────
  const [ordersList, setOrdersList] = useState([
    {
      id: 'CZ-849201',
      customer: 'Alex Jaiswal',
      phone: '+91 91380 04800',
      items: '5 kg Wash & Fold + 2-Piece Suit',
      amount: 448,
      status: 'In Studio (Eco-Wash)',
      statusStep: 3,
      store: 'Sector 41 Noida',
      date: 'Today, 11:30 AM',
      driver: 'David Santos (EV Van #14)',
      address: 'Supertech Supernova, Sector 94, Noida'
    },
    {
      id: 'CZ-849202',
      customer: 'Rishab Singh',
      phone: '+91 93105 90680',
      items: 'Designer Sneaker Deep Clean',
      amount: 299,
      status: 'Steam Ironing & QC',
      statusStep: 4,
      store: 'Sector 41 Noida',
      date: 'Today, 01:15 PM',
      driver: 'David Santos (EV Van #14)',
      address: '2735, 27th Floor Super Astilis, Sector 94, Noida'
    },
    {
      id: 'CZ-849199',
      customer: 'Pooja Verma',
      phone: '+91 98112 34567',
      items: '3 Silk Sarees Dry Clean',
      amount: 897,
      status: 'Pickup Dispatched',
      statusStep: 2,
      store: 'Sector 41 Noida',
      date: 'Today, 02:00 PM',
      driver: 'Rahul Verma (EV Bike #08)',
      address: 'C Block Market, Sector 41, Noida'
    },
    {
      id: 'CZ-849188',
      customer: 'Vikram Malhotra',
      phone: '+91 98711 22334',
      items: '12 kg Commercial Bulk Wash',
      amount: 588,
      status: 'Delivered',
      statusStep: 6,
      store: 'Sector 137 Noida',
      date: 'Yesterday',
      driver: 'Amit Kumar (EV Van #03)',
      address: 'Supertech Mart, Sector 137, Noida'
    }
  ]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    customer: '', phone: '', items: 'Standard Wash & Fold', amount: 249,
    store: 'Sector 41 Noida', address: ''
  });

  // ── Franchise Leads State (CRUD) ───────────────────────────────────────────
  const [franchiseLeads, setFranchiseLeads] = useState([
    {
      id: 'FL-101',
      name: 'Rishab Singh',
      phone: '9310590680',
      city: 'Noida / Greater Noida West',
      model: 'Beta Model (₹15 Lacs)',
      space: '500 - 1000 sq ft',
      status: 'New Lead',
      date: 'Today, 04:30 PM'
    },
    {
      id: 'FL-102',
      name: 'Karan Mehra',
      phone: '9810012345',
      city: 'Indirapuram, Ghaziabad',
      model: 'Alpha Model (₹13 Lacs)',
      space: '300 - 500 sq ft',
      status: 'Under Review',
      date: 'Aug 30, 2026'
    },
    {
      id: 'FL-103',
      name: 'Suresh Singhania',
      phone: '9820055443',
      city: 'Bandra West, Mumbai',
      model: 'Hydro-Carbon Model (₹35 Lacs+)',
      space: '1200 sq ft',
      status: 'Approved & Onboarding',
      date: 'Aug 28, 2026'
    }
  ]);

  // ── Services & Pricing State (CRUD) ────────────────────────────────────────
  const [servicesCatalog, setServicesCatalog] = useState([
    { id: 'wf_bag', name: 'Standard Wash & Fold', price: 49, unit: '/ kg', category: 'Laundry', tag: 'Bestseller' },
    { id: 'dc_suit', name: '2-Piece Men / Women Suit', price: 399, unit: '/ suit', category: 'Dry Clean', tag: 'Premium' },
    { id: 'dc_shirt', name: 'Steam Press Formal Shirt', price: 29, unit: '/ pc', category: 'Steam Iron', tag: 'Fast' },
    { id: 'dc_sneaker', name: 'Designer Sneaker Deep Clean', price: 299, unit: '/ pair', category: 'Shoe Spa', tag: 'Popular' },
    { id: 'dc_curtain', name: 'Blackout Curtains Eco-Clean', price: 149, unit: '/ panel', category: 'Home Care', tag: 'Organic' },
  ]);
  const [editingService, setEditingService] = useState(null);

  // ── Order Status Workflow Steps ────────────────────────────────────────────
  const ORDER_STATUS_STEPS = [
    'Order Placed',
    'Pickup Dispatched',
    'In Studio (Eco-Wash)',
    'Steam Ironing & QC',
    'Out for Delivery',
    'Delivered'
  ];

  // Fetch live orders from backend when admin panel is open
  useEffect(() => {
    if (isAuthenticated) {
      api.admin.getOrders()
        .then(res => {
          if (res.orders && res.orders.length > 0) {
            // Map backend schema to admin view schema
            const mapped = res.orders.map(o => ({
              id: o.id,
              customer: o.customerName || o.customer || 'Customer',
              phone: o.customerPhone || o.phone || '+91 9310590680',
              items: Array.isArray(o.items) ? o.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : (o.items || 'Wash & Fold'),
              amount: o.totalPrice || o.amount || 249,
              status: o.status || 'Order Placed',
              statusStep: o.statusStep || 1,
              store: o.studioName || o.store || 'Sector 41 Noida',
              date: o.pickupDate || 'Today',
              driver: o.driver ? (typeof o.driver === 'object' ? `${o.driver.name} (${o.driver.vehicle})` : o.driver) : 'David Santos (EV Van #14)',
              address: o.address || 'Sector 94, Noida'
            }));
            setOrdersList(mapped);
          }
        })
        .catch(err => console.log('Using local orders in AdminPanel:', err.message));

      // Fetch live stores from MongoDB Atlas backend
      api.stores.getAll()
        .then(res => {
          if (res.stores && res.stores.length > 0) {
            setStoresList(res.stores);
          }
        })
        .catch(err => console.log('Using local stores in AdminPanel:', err.message));
    }
  }, [isAuthenticated]);

  const handleUpdateOrderStatus = (orderId, newStepIndex) => {
    const newStatus = ORDER_STATUS_STEPS[newStepIndex - 1];
    setOrdersList(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          statusStep: newStepIndex,
          status: newStatus
        };
      }
      return o;
    }));

    // Sync status change to backend
    api.orders.updateStatus(orderId, {
      statusStep: newStepIndex,
      status: newStatus,
      progress: Math.round((newStepIndex / 6) * 100)
    }).catch(err => console.warn('Could not sync status to backend:', err.message));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Delete order #${orderId}?`)) {
      setOrdersList(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const newOrd = {
      id: `CZ-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: newOrderData.customer || 'Walk-in Customer',
      phone: newOrderData.phone || '+91 91380 04800',
      items: newOrderData.items,
      amount: parseFloat(newOrderData.amount) || 199,
      status: 'Order Placed',
      statusStep: 1,
      store: newOrderData.store,
      date: 'Just now',
      driver: 'David Santos (EV Van #14)',
      address: newOrderData.address || 'Direct Store Drop'
    };
    setOrdersList([newOrd, ...ordersList]);
    setShowAddOrderModal(false);
    setNewOrderData({ customer: '', phone: '', items: 'Standard Wash & Fold', amount: 249, store: 'Sector 41 Noida', address: '' });

    // Sync to backend
    try {
      await api.orders.create({
        customerName: newOrd.customer,
        customerPhone: newOrd.phone,
        address: newOrd.address,
        totalPrice: newOrd.amount,
        studioName: newOrd.store,
        status: newOrd.status,
        statusStep: newOrd.statusStep
      });
    } catch (err) {
      console.warn('Admin order saved locally:', err.message);
    }
  };

  // ── Store CRUD Handlers (MongoDB Atlas Connected) ─────────────────────────
  const handleSaveStore = async (e) => {
    e.preventDefault();
    setIsSubmittingStore(true);
    setStoreActionMsg('');

    const storePayload = {
      ...storeFormData,
      priceList: Array.isArray(storeFormData.priceList) && storeFormData.priceList.length > 0
        ? storeFormData.priceList
        : DEFAULT_STUDIO_PRICE_ITEMS
    };

    try {
      if (editingStore) {
        // Update store in backend & MongoDB Atlas
        const res = await api.stores.update(editingStore.id, storePayload);
        const updated = (res && res.store) ? res.store : { ...storePayload, id: editingStore.id };
        setStoresList(prev => prev.map(s => s.id === editingStore.id ? updated : s));
        setEditingStore(null);
        setShowAddStoreModal(false);
        setStoreActionMsg(`✅ Studio "${updated.name}" updated in MongoDB Atlas!`);
      } else {
        // Create new store in backend & MongoDB Atlas
        const res = await api.stores.create(storePayload);
        const createdStore = (res && res.store) ? res.store : { ...storePayload, id: Date.now() };
        setStoresList(prev => [createdStore, ...prev]);
        setShowAddStoreModal(false);
        setStoreActionMsg(`🚀 New Studio "${createdStore.name}" created with custom price list and saved to MongoDB Atlas!`);
      }

      // Reset form
      setStoreFormData({
        name: '', address: '', city: 'Noida', state: 'Uttar Pradesh',
        phone: '9138004800', whatsapp: '919138004800', rating: 4.8, reviews: 10,
        lat: 28.5445, lng: 77.3292, openingTime: '08:00 AM - 09:00 PM',
        status: 'Active', tags: 'Dry Cleaning, Wash & Fold, Steam Press',
        priceList: JSON.parse(JSON.stringify(DEFAULT_STUDIO_PRICE_ITEMS))
      });
      setShowModalPriceListEditor(false);
    } catch (err) {
      console.error('Error saving store:', err.message);
      // Fallback local update
      if (editingStore) {
        setStoresList(prev => prev.map(s => s.id === editingStore.id ? { ...storePayload, id: editingStore.id } : s));
        setEditingStore(null);
      } else {
        const localNewStore = { ...storePayload, id: Date.now() };
        setStoresList(prev => [localNewStore, ...prev]);
      }
      setShowAddStoreModal(false);
      setStoreActionMsg(`⚠️ Studio saved locally (${err.message})`);
    } finally {
      setIsSubmittingStore(false);
      setTimeout(() => setStoreActionMsg(''), 5000);
    }
  };

  const handleConfirmDeleteStore = async () => {
    if (!storeToDelete) return;
    setIsDeletingStore(true);

    const storeId = storeToDelete.id || storeToDelete._id;
    const storeName = storeToDelete.name;

    try {
      await api.stores.delete(storeId);
      setStoresList(prev => prev.filter(s => s.id !== storeToDelete.id && s._id !== storeToDelete._id));
      setStoreActionMsg(`🗑️ Studio "${storeName}" deleted successfully from MongoDB Atlas!`);
      setStoreToDelete(null);
    } catch (err) {
      console.warn('Backend delete failed, removing locally:', err.message);
      setStoresList(prev => prev.filter(s => s.id !== storeToDelete.id && s._id !== storeToDelete._id));
      setStoreActionMsg(`🗑️ Studio "${storeName}" removed`);
      setStoreToDelete(null);
    } finally {
      setIsDeletingStore(false);
      setTimeout(() => setStoreActionMsg(''), 4000);
    }
  };

  // ── Price List Management Handlers ─────────────────────────────────────────
  const handleOpenPriceListModal = (store) => {
    setSelectedStoreForPriceList(store);
    const items = getRealCatalogForStore(store);
    setPriceListItems(JSON.parse(JSON.stringify(items)));
    setPriceListSearch('');
    setPriceListFilterCategory('all');
    setShowNewPriceItemForm(false);
  };

  const handleUpdateItemPrice = (itemId, newPrice) => {
    setPriceListItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, price: Number(newPrice) || 0 } : item
    ));
  };

  const handleDeletePriceItem = (itemId) => {
    setPriceListItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddNewPriceItem = (e) => {
    e.preventDefault();
    if (!newPriceItemInput.name.trim()) return;
    const itemToAdd = {
      id: `custom_${Date.now()}`,
      name: newPriceItemInput.name.trim(),
      service: newPriceItemInput.service,
      serviceKey: newPriceItemInput.service.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      category: newPriceItemInput.service.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      audience: newPriceItemInput.audience || 'Men',
      price: Number(newPriceItemInput.price) || 99,
      unit: newPriceItemInput.unit || '/ pc',
      desc: `${newPriceItemInput.service} care for ${newPriceItemInput.name.trim()}`
    };
    setPriceListItems(prev => [itemToAdd, ...prev]);
    setNewPriceItemInput({ name: '', service: 'Dry Clean', price: 199, unit: '/ pc', audience: 'Men' });
    setShowNewPriceItemForm(false);
  };

  const handleResetToStandardCatalog = () => {
    if (window.confirm("Reset price list to Cleanz24 standard national catalog?")) {
      setPriceListItems(JSON.parse(JSON.stringify(DEFAULT_STUDIO_PRICE_ITEMS)));
    }
  };

  const handleSavePriceListToBackend = async () => {
    if (!selectedStoreForPriceList) return;
    setIsSavingPriceList(true);
    const storeId = selectedStoreForPriceList.id || selectedStoreForPriceList._id;
    const storeName = selectedStoreForPriceList.name;

    try {
      await api.stores.updatePriceList(storeId, priceListItems);
      setStoresList(prev => prev.map(s => {
        if (s.id === storeId || s._id === storeId) {
          return { ...s, priceList: priceListItems };
        }
        return s;
      }));
      setStoreActionMsg(`🏷️ Price list for "${storeName}" (${priceListItems.length} items) saved to MongoDB Atlas!`);
      setSelectedStoreForPriceList(null);
    } catch (err) {
      console.warn('Backend price list update failed, saving locally:', err.message);
      setStoresList(prev => prev.map(s => {
        if (s.id === storeId || s._id === storeId) {
          return { ...s, priceList: priceListItems };
        }
        return s;
      }));
      setStoreActionMsg(`🏷️ Price list for "${storeName}" saved locally`);
      setSelectedStoreForPriceList(null);
    } finally {
      setIsSavingPriceList(false);
      setTimeout(() => setStoreActionMsg(''), 5000);
    }
  };

  // ── Unified Admin Portal Data Computations ──────────────────────────────
  const roleOrders = selectedStudio === 'All Stores'
    ? ordersList
    : ordersList.filter(o => {
        const s = selectedStudio.toLowerCase();
        const os = o.store.toLowerCase();
        return s.includes(os) || os.includes(s);
      });

  const filteredOrders = roleOrders.filter(o => {
    const matchesFilter = orderFilter === 'all' || 
      (orderFilter === 'active' && o.status !== 'Delivered') ||
      (orderFilter === 'completed' && o.status === 'Delivered');
    const matchesSearch = o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  const filteredStores = storesList.filter(s => 
    s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
    s.city.toLowerCase().includes(storeSearch.toLowerCase()) ||
    s.state.toLowerCase().includes(storeSearch.toLowerCase())
  );

  // Fleet Valets
  const roleValets = [
    { name: 'David Santos', role: 'Cleanz EV Van #14', area: 'Sector 41, Sector 94, Sector 18 Noida', status: 'On Delivery', rating: '4.9 ⭐', phone: '+91 91380 04800', store: 'Sector 41 Noida' },
    { name: 'Rahul Verma', role: 'Cleanz EV Bike #08', area: 'Sector 41, Sector 50 Noida', status: 'Available', rating: '4.8 ⭐', phone: '+91 91380 04801', store: 'Sector 41 Noida' },
    { name: 'Amit Kumar', role: 'Cleanz EV Van #03', area: 'Sector 137, Advant Navis Park', status: 'On Pickup', rating: '4.9 ⭐', phone: '+91 91380 04802', store: 'Sector 137 Noida' },
  ];

  // Store revenue calculation
  const storeTodayRevenue = roleOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  // Unified Admin Navigation Tabs
  const availableTabs = [
    { id: 'overview', label: 'Pan-India Overview', icon: BarChart3 },
    { id: 'orders', label: `All Orders (${ordersList.length})`, icon: Package },
    { id: 'stores', label: `100+ Studios (${storesList.length})`, icon: Store },
    { id: 'pricing', label: 'Master Pricing CRUD', icon: Tag },
    { id: 'fleet', label: 'Valets & VIP Fleet', icon: Truck },
  ];

  // ── Dynamic Theme Tokens (Light / Dark Mode) ────────────────────────────────
  const isDark = darkMode;
  const t = {
    bg: isDark ? '#0B0F14' : '#F8FAFC',
    color: isDark ? '#E2E8F0' : '#1E293B',
    headerBg: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
    headerBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    cardBg: isDark ? 'rgba(30, 41, 59, 0.5)' : '#FFFFFF',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    cardShadow: isDark ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.04)',
    subCardBg: isDark ? 'rgba(15, 23, 42, 0.6)' : '#F1F5F9',
    subCardBorder: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
    tabBarBg: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
    tabBarBorder: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
    inputBg: isDark ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    textTitle: isDark ? '#FFFFFF' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    textBody: isDark ? '#CBD5E1' : '#334155',
    tableHeaderBg: isDark ? '#0F172A' : '#F8FAFC',
    modalBg: isDark ? '#0F172A' : '#FFFFFF',
    badgeBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // ── VIEW 1: SECURITY GATE & ROLE PASSWORD AUTHENTICATION SCREEN ─────────────
  // ══════════════════════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100%',
        flex: 1,
        background: t.bg,
        color: t.color,
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px',
        boxSizing: 'border-box'
      }}>
        {/* Security Auth Box */}
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: '24px',
          padding: '24px 20px',
          boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 10px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Brand Header */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #15803D, #22C55E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              <Lock size={26} color="#FFF" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0', color: t.textTitle }}>
              Cleanz24 Admin Portal
            </h2>
            <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>
              Authorized Security Terminal • Enter Admin Passcode
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* PIN / Password Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: '700', color: t.textTitle }}>
                  🔑 Master Admin Passcode
                </label>
                <button
                  type="button"
                  onClick={() => setShowPinMask(!showPinMask)}
                  style={{ background: 'none', border: 'none', color: t.textMuted, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  {showPinMask ? <Eye size={12} /> : <Lock size={12} />}
                  {showPinMask ? 'Hide' : 'Show'}
                </button>
              </div>

              <input
                type={showPinMask ? 'text' : 'password'}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="Enter Master PIN (Default: 9999)"
                autoFocus
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  borderRadius: '12px',
                  border: authError ? '1.5px solid #EF4444' : `1px solid ${t.cardBorder}`,
                  background: isDark ? '#0F172A' : '#F1F5F9',
                  color: t.textTitle,
                  fontSize: '15px',
                  fontWeight: '700',
                  letterSpacing: showPinMask ? '1px' : '4px',
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Error Message */}
            {authError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px 12px',
                borderRadius: '10px',
                color: '#EF4444',
                fontSize: '11.5px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {authError}
              </div>
            )}

            {/* Quick Demo Credentials Helpers */}
            <div style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '11px',
              color: t.textMuted,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ fontWeight: '700', color: t.textTitle }}>⚡ Quick Demo Credentials:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>👑 <strong>Master Admin Passcode:</strong> <code style={{ color: 'var(--primary-green)', fontWeight: '800' }}>9999</code></span>
                <button
                  type="button"
                  onClick={() => { setEnteredPin('9999'); }}
                  style={{ background: 'rgba(39, 162, 67, 0.15)', border: 'none', color: 'var(--primary-green)', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Auto-Fill
                </button>
              </div>
            </div>

            {/* Unlock Button */}
            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: '14px',
                background: 'var(--primary-green)',
                border: 'none',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(39, 162, 67, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Lock size={16} /> Unlock Admin Dashboard
            </button>
          </form>

          {/* Back to App button */}
          <button
            type="button"
            onClick={onExitToApp}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              color: t.textMuted,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={14} /> Back to Customer App
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // ── VIEW 2: AUTHENTICATED ADMIN DASHBOARD ───────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      flex: 1,
      background: t.bg,
      color: t.color,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>

      {/* ── Top Master Header Bar ────────────────────────────────────────────── */}
      <header style={{
        background: t.headerBg,
        borderBottom: `1px solid ${t.headerBorder}`,
        padding: '12px 14px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(12px)'
      }}>
        {/* Left Brand & Active Badge */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3C8B35, #27A243)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(39, 162, 67, 0.4)'
            }}>
              <ShieldCheck size={18} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: t.textTitle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Cleanz24 Control
                <span className="badge badge-green" style={{ fontSize: '8.5px', padding: '1px 5px' }}>
                  👑 MASTER ADMIN
                </span>
              </div>
              <div style={{ fontSize: '10px', color: t.textMuted }}>
                Pan-India 100+ Studios HQ Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions: Store Branch Filter, Lock Terminal, Theme Toggle & Exit */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {/* Store Branch Filter Dropdown */}
          <select
            value={selectedStudio}
            onChange={e => setSelectedStudio(e.target.value)}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              background: isDark ? 'rgba(39, 162, 67, 0.15)' : 'rgba(39, 162, 67, 0.08)',
              border: '1px solid rgba(39, 162, 67, 0.4)',
              color: isDark ? '#4ADE80' : '#15803D',
              fontSize: '11px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="All Stores">🏢 All Stores (100+)</option>
            <option value="Sector 41 Noida">Sector 41 Noida</option>
            <option value="Sector 137 Noida">Sector 137 Noida</option>
            <option value="Patwari Greater Noida West">Gr. Noida West</option>
            <option value="Indirapuram">Indirapuram</option>
            <option value="Vaishali Ghaziabad">Vaishali</option>
          </select>

          {/* Day / Night Mode Toggle Button */}
          <button
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
            style={{
              padding: '6px 10px',
              borderRadius: '9px',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
              background: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
              color: isDark ? '#FBBF24' : '#0284C7',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'
            }}
            title="Toggle Day / Night Mode"
          >
            {isDark ? <Sun size={13} color="#FBBF24" /> : <Moon size={13} color="#0284C7" />}
            <span>{isDark ? '☀️ Day' : '🌙 Night'}</span>
          </button>

          {/* Lock Terminal Button */}
          <button
            onClick={handleLockTerminal}
            style={{
              padding: '6px 10px',
              borderRadius: '9px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#F59E0B',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Lock admin terminal"
          >
            <Lock size={12} /> Lock Terminal
          </button>

          <button
            onClick={onExitToApp}
            style={{
              padding: '6px 12px',
              borderRadius: '9px',
              border: '1px solid rgba(39, 162, 67, 0.4)',
              background: 'rgba(39, 162, 67, 0.15)',
              color: 'var(--primary-green)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Smartphone size={13} /> Exit to App
          </button>
        </div>
      </header>

      {/* ── Navigation Tabs ───────────────────── */}
      <div style={{
        background: t.tabBarBg,
        borderBottom: `1px solid ${t.tabBarBorder}`,
        padding: '0 14px',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto'
      }}>
        {availableTabs.map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--primary-green)' : '3px solid transparent',
                color: isActive ? t.textTitle : t.textMuted,
                fontSize: '12px',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <IconComp size={15} color={isActive ? 'var(--primary-green)' : t.textMuted} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Main Dashboard Body ──────────────────────────────────────────────── */}
      <main style={{ padding: '24px 20px', flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Stat Cards (2x2 Grid: 2 Upar, 2 Niche) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              {[
                { title: "Turnover", val: selectedStudio === 'All Stores' ? '₹48,920' : '₹12,450', sub: '+18.4% today', icon: DollarSign, color: '#16A34A', targetTab: 'orders' },
                { title: 'Active Studios', val: `${storesList.length} Active`, sub: 'Pan-India Network →', icon: Store, color: '#D97706', targetTab: 'stores' },
                { title: 'Today Orders', val: `${ordersList.length}`, sub: 'Across all studios →', icon: Package, color: '#2563EB', targetTab: 'orders' },
                { title: 'VIP Customers', val: '1,420 Active', sub: '98.2% Satisfaction', icon: Users, color: '#9333EA' }
              ].map((stat, i) => {
                const IconComp = stat.icon;
                return (
                  <div 
                    key={i} 
                    id={stat.targetTab ? `stat-card-${stat.targetTab}` : undefined}
                    onClick={() => stat.targetTab && setActiveTab(stat.targetTab)}
                    style={{
                      background: t.cardBg,
                      border: `1px solid ${t.cardBorder}`,
                      borderRadius: '16px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '6px',
                      cursor: stat.targetTab ? 'pointer' : 'default',
                      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: t.textMuted, fontWeight: '600' }}>{stat.title}</span>
                      <div style={{ padding: '6px', borderRadius: '8px', background: `${stat.color}18`, color: stat.color, flexShrink: 0 }}>
                        <IconComp size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: t.textTitle }}>{stat.val}</div>
                    <div style={{ fontSize: '10.5px', color: stat.color, fontWeight: '600' }}>{stat.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Franchise Studios Network Overview Hub */}
            <div style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', margin: 0, color: t.textTitle }}>
                    {selectedStudio === 'All Stores' ? 'Franchise Studios Network Overview (Pan-India)' : `Studio Hub Overview for ${selectedStudio}`}
                  </h3>
                  <div style={{ fontSize: '12px', color: t.textMuted }}>Live operational status, locations and dedicated store price lists</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setEditingStore(null);
                      setStoreFormData({
                        name: '', address: '', city: 'Noida', state: 'Uttar Pradesh',
                        phone: '9138004800', whatsapp: '919138004800', rating: 4.8, reviews: 10,
                        lat: 28.5445, lng: 77.3292, openingTime: '08:00 AM - 09:00 PM',
                        status: 'Active', tags: 'Dry Cleaning, Wash & Fold, Steam Press',
                        priceList: JSON.parse(JSON.stringify(DEFAULT_STUDIO_PRICE_ITEMS))
                      });
                      setShowModalPriceListEditor(false);
                      setShowAddStoreModal(true);
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: 'var(--primary-green)',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} /> + Add Studio
                  </button>
                  <button
                    onClick={() => setActiveTab('stores')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                      border: `1px solid ${t.cardBorder}`,
                      color: t.textTitle,
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    View All {storesList.length} Studios →
                  </button>
                </div>
              </div>

              {/* Studio Overview Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {storesList.slice(0, 6).map(store => (
                  <div key={store.id} style={{
                    background: t.subCardBg,
                    border: `1px solid ${t.subCardBorder}`,
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: t.textTitle }}>{store.name}</span>
                      <span className="badge badge-green" style={{ fontSize: '9.5px' }}>{store.status || 'Active'}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: t.textMuted }}>
                      📍 {store.address || `${store.city}, ${store.state}`}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: t.textBody, borderTop: `1px solid ${t.subCardBorder}`, paddingTop: '8px', marginTop: '2px' }}>
                      <span>⭐ {store.rating || 4.8} ({store.reviews || 25} reviews)</span>
                      <button
                        onClick={() => handleOpenPriceListModal(store)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: isDark ? 'rgba(39, 162, 67, 0.15)' : 'rgba(39, 162, 67, 0.1)',
                          border: '1px solid rgba(39, 162, 67, 0.3)',
                          color: 'var(--primary-green)',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Tag size={11} /> Price List ({getRealCatalogForStore(store).length})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: ORDERS MANAGER (FULL CRUD & STEPPER) ─────────────────────── */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Header & Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'active', 'completed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: `1px solid ${orderFilter === f ? 'var(--primary-green)' : t.cardBorder}`,
                      background: orderFilter === f ? 'var(--primary-green)' : (isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF'),
                      color: orderFilter === f ? '#FFF' : t.textMuted,
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {f} Orders
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: t.textMuted }} />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Phone..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    style={{
                      padding: '8px 12px 8px 30px',
                      borderRadius: '10px',
                      border: `1px solid ${t.inputBorder}`,
                      background: t.inputBg,
                      color: t.textTitle,
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowAddOrderModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'var(--primary-green)',
                    border: 'none',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> + New Order
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: t.cardShadow
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.cardBorder}`, color: t.textMuted, fontSize: '11px', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px' }}>ORDER ID</th>
                    <th style={{ padding: '12px 16px' }}>CUSTOMER & PHONE</th>
                    <th style={{ padding: '12px 16px' }}>ITEMS</th>
                    <th style={{ padding: '12px 16px' }}>AMOUNT</th>
                    <th style={{ padding: '12px 16px' }}>CURRENT STATUS</th>
                    <th style={{ padding: '12px 16px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: `1px solid ${t.subCardBorder}` }}>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: t.textTitle }}>
                        #{order.id}
                        <div style={{ fontSize: '11px', color: t.textMuted, fontWeight: '400' }}>{order.date}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: t.textTitle }}>{order.customer}</div>
                        <div style={{ fontSize: '11px', color: t.textMuted }}>{order.phone}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: t.textBody }}>
                        {order.items}
                        <div style={{ fontSize: '11px', color: t.textMuted }}>📍 {order.address}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--primary-green)' }}>
                        ₹{order.amount}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={order.statusStep}
                          onChange={e => handleUpdateOrderStatus(order.id, parseInt(e.target.value))}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            background: isDark ? 'rgba(39, 162, 67, 0.12)' : 'rgba(39, 162, 67, 0.08)',
                            border: '1px solid rgba(39, 162, 67, 0.4)',
                            color: isDark ? 'var(--primary-green)' : '#15803D',
                            fontSize: '12px',
                            fontWeight: '700',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {ORDER_STATUS_STEPS.map((step, idx) => (
                            <option key={idx} value={idx + 1} style={{ background: isDark ? '#1E232A' : '#FFFFFF', color: isDark ? '#FFF' : '#0F172A' }}>
                              Step {idx + 1}: {step}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#EF4444',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                          title="Cancel Order"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ── TAB 3: 100+ STORES NETWORK MANAGER (CRUD) ──────────────────────── */}
        {activeTab === 'stores' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {storeActionMsg && (
              <div style={{
                padding: '12px 18px',
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                color: '#4ADE80',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} /> {storeActionMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: t.textTitle }}>
                  Franchise Studios ({storesList.length}) Pan-India
                </h3>
                <div style={{ fontSize: '12px', color: t.textMuted }}>
                  Manage nationwide Cleanz24 studio locations · Real-time synced with MongoDB Atlas
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Filter by city / sector..."
                  value={storeSearch}
                  onChange={e => setStoreSearch(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${t.inputBorder}`,
                    background: t.inputBg,
                    color: t.textTitle,
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  id="btn-add-new-studio"
                  onClick={() => {
                    setEditingStore(null);
                    setStoreFormData({
                      name: '', address: '', city: 'Noida', state: 'Uttar Pradesh',
                      phone: '9138004800', whatsapp: '919138004800', rating: 4.8, reviews: 10,
                      lat: 28.5445, lng: 77.3292, openingTime: '08:00 AM - 09:00 PM',
                      status: 'Active', tags: 'Dry Cleaning, Wash & Fold, Steam Press',
                      priceList: JSON.parse(JSON.stringify(DEFAULT_STUDIO_PRICE_ITEMS))
                    });
                    setShowModalPriceListEditor(false);
                    setShowAddStoreModal(true);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'var(--primary-green)',
                    border: 'none',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> + Add New Studio
                </button>
              </div>
            </div>

            {/* Stores Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
              {filteredStores.map(store => (
                <div key={store.id} style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: t.cardShadow
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: t.textTitle }}>{store.name}</h4>
                      <span className="badge badge-amber" style={{ fontSize: '9px', marginTop: '4px' }}>
                        {store.city}, {store.state}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        id={`btn-pricelist-${store.id}`}
                        onClick={() => handleOpenPriceListModal(store)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '8px',
                          background: isDark ? 'rgba(39, 162, 67, 0.15)' : 'rgba(39, 162, 67, 0.1)',
                          border: '1px solid rgba(39, 162, 67, 0.35)',
                          color: 'var(--primary-green)',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title={`Manage Price List for ${store.name}`}
                      >
                        <Tag size={12} /> Price List ({getRealCatalogForStore(store).length})
                      </button>
                      <button
                        onClick={() => {
                          setEditingStore(store);
                          const storeCatalog = getRealCatalogForStore(store);
                          setStoreFormData({
                            ...store,
                            priceList: JSON.parse(JSON.stringify(storeCatalog))
                          });
                          setShowModalPriceListEditor(false);
                          setShowAddStoreModal(true);
                        }}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#3B82F6',
                          cursor: 'pointer'
                        }}
                        title={`Edit ${store.name}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setStoreToDelete(store)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#EF4444',
                          cursor: 'pointer'
                        }}
                        title={`Delete ${store.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: t.textMuted, margin: 0, lineHeight: 1.4 }}>
                    📍 {store.address}
                  </p>

                  <div style={{ fontSize: '11px', color: t.textBody, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${t.subCardBorder}`, paddingTop: '8px', marginTop: '4px' }}>
                    <span>📞 {store.phone}</span>
                    <span>⭐ {store.rating} ({store.reviews} reviews)</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}


        {/* ── TAB 5: SERVICES & PRICING CRUD ─────────────────────────────────── */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, color: t.textTitle }}>Master Services & Pricing Catalog</h3>
                <div style={{ fontSize: '12px', color: t.textMuted }}>Set base laundry and dry cleaning pricing formulas</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {servicesCatalog.map(serv => (
                <div key={serv.id} style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: t.cardShadow
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: t.textTitle }}>{serv.name}</span>
                    <span className="badge badge-amber" style={{ fontSize: '9px' }}>{serv.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-green)' }}>₹{serv.price}</span>
                    <span style={{ fontSize: '12px', color: t.textMuted }}>{serv.unit}</span>
                  </div>
                  <button
                    onClick={() => {
                      const newPrice = prompt(`Enter new price for ${serv.name}:`, serv.price);
                      if (newPrice && !isNaN(newPrice)) {
                        setServicesCatalog(prev => prev.map(s => s.id === serv.id ? { ...s, price: parseFloat(newPrice) } : s));
                      }
                    }}
                    style={{
                      padding: '7px',
                      borderRadius: '8px',
                      background: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                      border: `1px solid ${t.cardBorder}`,
                      color: t.textTitle,
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    ✏️ Update Price Formula
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: FLEET & VIP MEMBERS ─────────────────────────────────────── */}
        {activeTab === 'fleet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', margin: 0, color: t.textTitle }}>
                {selectedStudio === 'All Stores' ? 'Pan-India Valet Fleet & VIP Customer Accounts' : `Assigned Valet Fleet for ${selectedStudio}`}
              </h3>
              <div style={{ fontSize: '12px', color: t.textMuted }}>Live delivery dispatchers and registered high-value members</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {roleValets.map((valet, i) => (
                <div key={i} style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: t.cardShadow
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '800', color: t.textTitle, fontSize: '15px' }}>{valet.name}</div>
                    <span className="badge badge-green" style={{ fontSize: '9px' }}>{valet.status}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: t.textMuted }}>{valet.role} • {valet.rating}</div>
                  <div style={{ fontSize: '11px', color: t.textBody }}>📍 Coverage: {valet.area}</div>
                  <div style={{ fontSize: '11px', color: 'var(--primary-green)', fontWeight: '700', marginTop: '4px' }}>📞 {valet.phone}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── MODAL: CREATE ORDER ──────────────────────────────────────────────── */}
      {showAddOrderModal && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="bottom-sheet animate-fade-in" style={{ padding: '20px', maxWidth: '440px', background: isDark ? '#0F172A' : '#FFFFFF', color: t.textTitle, borderRadius: '24px', border: `1px solid ${t.cardBorder}`, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', margin: 0, color: t.textTitle }}>Create Walk-in / Phone Order</h3>
              <button className="btn-icon" onClick={() => setShowAddOrderModal(false)}><X size={15} /></button>
            </div>

            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Customer Name"
                value={newOrderData.customer}
                onChange={e => setNewOrderData({ ...newOrderData, customer: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none' }}
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={newOrderData.phone}
                onChange={e => setNewOrderData({ ...newOrderData, phone: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none' }}
              />
              <input
                type="text"
                placeholder="Garment Items (e.g. 5kg Wash, 2 Suits)"
                value={newOrderData.items}
                onChange={e => setNewOrderData({ ...newOrderData, items: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none' }}
              />
              <input
                type="number"
                placeholder="Total Amount (₹)"
                value={newOrderData.amount}
                onChange={e => setNewOrderData({ ...newOrderData, amount: e.target.value })}
                required
                style={{ padding: '10px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                Save & Dispatch Order ✓
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT STORE (MONGODB ATLAS CONNECTED) ──────────────── */}
      {showAddStoreModal && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="bottom-sheet animate-fade-in" style={{ padding: '24px', maxWidth: '500px', background: isDark ? '#0F172A' : '#FFFFFF', color: t.textTitle, borderRadius: '24px', border: `1px solid ${t.cardBorder}`, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div className="sheet-handle" />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: t.textTitle }}>
                  {editingStore ? 'Edit Franchise Studio' : 'Add New Cleanz24 Studio'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#22C55E', marginTop: '3px' }}>
                  <Sparkles size={13} /> Live Sync with MongoDB Atlas
                </div>
              </div>
              <button className="btn-icon" onClick={() => setShowAddStoreModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveStore} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Studio Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Cleanz24 - Sector 62 Studio"
                  value={storeFormData.name}
                  onChange={e => setStoreFormData({ ...storeFormData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Complete Address *</label>
                <textarea
                  placeholder="e.g. Shop 12, Ground Floor, Stellar IT Park, Sector 62, Noida"
                  value={storeFormData.address}
                  onChange={e => setStoreFormData({ ...storeFormData, address: e.target.value })}
                  required
                  rows={2}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Noida / Mumbai / Delhi"
                    value={storeFormData.city}
                    onChange={e => setStoreFormData({ ...storeFormData, city: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>State *</label>
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={storeFormData.state}
                    onChange={e => setStoreFormData({ ...storeFormData, state: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Phone / Helpline</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9138004800"
                    value={storeFormData.phone}
                    onChange={e => setStoreFormData({ ...storeFormData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>WhatsApp Direct</label>
                  <input
                    type="tel"
                    placeholder="e.g. 919138004800"
                    value={storeFormData.whatsapp}
                    onChange={e => setStoreFormData({ ...storeFormData, whatsapp: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Opening Hours</label>
                  <input
                    type="text"
                    placeholder="08:00 AM - 09:00 PM"
                    value={storeFormData.openingTime || ''}
                    onChange={e => setStoreFormData({ ...storeFormData, openingTime: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Studio Status</label>
                  <select
                    value={storeFormData.status || 'Active'}
                    onChange={e => setStoreFormData({ ...storeFormData, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? '#1E293B' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="Active" style={{ background: isDark ? '#0F172A' : '#FFFFFF', color: t.textTitle }}>🟢 Active & Operational</option>
                    <option value="Opening Soon" style={{ background: isDark ? '#0F172A' : '#FFFFFF', color: t.textTitle }}>🟡 Opening Soon</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Latitude (Map GPS)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="28.5445"
                    value={storeFormData.lat}
                    onChange={e => setStoreFormData({ ...storeFormData, lat: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Longitude (Map GPS)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="77.3292"
                    value={storeFormData.lng}
                    onChange={e => setStoreFormData({ ...storeFormData, lng: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: t.textMuted, fontWeight: '600', marginBottom: '4px', display: 'block' }}>Offered Services / Tags</label>
                <input
                  type="text"
                  placeholder="Dry Cleaning, Wash & Fold, Steam Press, Shoe Spa"
                  value={Array.isArray(storeFormData.tags) ? storeFormData.tags.join(', ') : (storeFormData.tags || '')}
                  onChange={e => setStoreFormData({ ...storeFormData, tags: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', border: `1px solid ${t.cardBorder}`, color: t.textTitle, fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* ── Studio Price List Configuration Section ── */}
              <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                border: `1px solid ${t.cardBorder}`,
                borderRadius: '14px',
                padding: '14px',
                marginTop: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: t.textTitle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={14} color="var(--primary-green)" /> Studio Custom Price List ({storeFormData.priceList?.length || 9} items)
                    </div>
                    <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px' }}>
                      Set separate service prices for this specific studio
                    </div>
                  </div>
                  <button
                    type="button"
                    id="btn-toggle-new-store-pricelist"
                    onClick={() => setShowModalPriceListEditor(!showModalPriceListEditor)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: isDark ? 'rgba(39, 162, 67, 0.2)' : 'rgba(39, 162, 67, 0.1)',
                      border: '1px solid rgba(39, 162, 67, 0.4)',
                      color: 'var(--primary-green)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {showModalPriceListEditor ? 'Collapse ▲' : 'Customize Prices ⚙️ ▼'}
                  </button>
                </div>

                {showModalPriceListEditor && (
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                      {(storeFormData.priceList || DEFAULT_STUDIO_PRICE_ITEMS).map((item, idx) => (
                        <div key={item.id || idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          background: isDark ? 'rgba(15, 23, 42, 0.7)' : '#FFFFFF',
                          border: `1px solid ${t.cardBorder}`
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <input
                              type="text"
                              value={item.name}
                              placeholder="Item Name"
                              onChange={e => {
                                const updated = (storeFormData.priceList || DEFAULT_STUDIO_PRICE_ITEMS).map((it, i) =>
                                  i === idx ? { ...it, name: e.target.value } : it
                                );
                                setStoreFormData({ ...storeFormData, priceList: updated });
                              }}
                              style={{
                                width: '100%',
                                padding: '4px 6px',
                                borderRadius: '6px',
                                border: '1px solid transparent',
                                background: 'transparent',
                                color: t.textTitle,
                                fontSize: '12px',
                                fontWeight: '700',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                              onFocus={e => e.target.style.borderColor = '#3B82F6'}
                              onBlur={e => e.target.style.borderColor = 'transparent'}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '6px' }}>
                              <select
                                value={item.service || 'Dry Clean'}
                                onChange={e => {
                                  const updated = (storeFormData.priceList || DEFAULT_STUDIO_PRICE_ITEMS).map((it, i) =>
                                    i === idx ? { ...it, service: e.target.value, category: e.target.value.toLowerCase().replace(/\s+/g, '_') } : it
                                  );
                                  setStoreFormData({ ...storeFormData, priceList: updated });
                                }}
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--primary-green)',
                                  fontWeight: '700',
                                  background: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0',
                                  outline: 'none'
                                }}
                              >
                                <option value="Dry Clean" style={{ background: isDark ? '#0F172A' : '#FFF', color: t.textTitle }}>Dry Clean</option>
                                <option value="Wash & Fold" style={{ background: isDark ? '#0F172A' : '#FFF', color: t.textTitle }}>Wash & Fold</option>
                                <option value="Steam Press" style={{ background: isDark ? '#0F172A' : '#FFF', color: t.textTitle }}>Steam Press</option>
                                <option value="Shoe Spa" style={{ background: isDark ? '#0F172A' : '#FFF', color: t.textTitle }}>Shoe Spa</option>
                                <option value="Bag Spa" style={{ background: isDark ? '#0F172A' : '#FFF', color: t.textTitle }}>Bag Spa</option>
                                <option value="Home Care" style={{ background: isDark ? '#0F172A' : '#FFF', color: t.textTitle }}>Home Care</option>
                              </select>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: t.textTitle }}>₹</span>
                            <input
                              type="number"
                              value={item.price}
                              onChange={e => {
                                const val = Number(e.target.value) || 0;
                                const updated = (storeFormData.priceList || DEFAULT_STUDIO_PRICE_ITEMS).map((it, i) =>
                                  i === idx ? { ...it, price: val } : it
                                );
                                setStoreFormData({ ...storeFormData, priceList: updated });
                              }}
                              style={{
                                width: '60px',
                                padding: '5px 6px',
                                borderRadius: '6px',
                                background: isDark ? '#1E293B' : '#F1F5F9',
                                border: `1px solid ${t.cardBorder}`,
                                color: 'var(--primary-green)',
                                fontSize: '12px',
                                fontWeight: '800',
                                textAlign: 'right',
                                outline: 'none'
                              }}
                            />
                            <input
                              type="text"
                              value={item.unit || '/ pc'}
                              onChange={e => {
                                const updated = (storeFormData.priceList || DEFAULT_STUDIO_PRICE_ITEMS).map((it, i) =>
                                  i === idx ? { ...it, unit: e.target.value } : it
                                );
                                setStoreFormData({ ...storeFormData, priceList: updated });
                              }}
                              style={{
                                width: '42px',
                                padding: '5px 2px',
                                borderRadius: '6px',
                                background: 'transparent',
                                border: '1px solid transparent',
                                color: t.textMuted,
                                fontSize: '11px',
                                textAlign: 'center',
                                outline: 'none'
                              }}
                              onFocus={e => e.target.style.borderColor = '#3B82F6'}
                              onBlur={e => e.target.style.borderColor = 'transparent'}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (storeFormData.priceList || DEFAULT_STUDIO_PRICE_ITEMS).filter((_, i) => i !== idx);
                                setStoreFormData({ ...storeFormData, priceList: updated });
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#EF4444',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="Remove Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Inline Add Custom Item Form (No browser prompts) */}
                    {showAddCustomPriceItem && (
                      <div className="animate-fade-in" style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF',
                        border: '1.5px dashed #3B82F6',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', letterSpacing: '0.04em' }}>
                            ✨ ADD NEW SERVICE / ITEM
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAddCustomPriceItem(false)}
                            style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                          >
                            ✕
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Item Name (e.g. Heavy Sherwani / Silk Saree)"
                          value={newCustomPriceDraft.name}
                          onChange={e => setNewCustomPriceDraft({ ...newCustomPriceDraft, name: e.target.value })}
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            background: isDark ? '#1E293B' : '#FFFFFF',
                            border: `1px solid ${t.cardBorder}`,
                            color: t.textTitle,
                            fontSize: '12.5px',
                            fontWeight: '600',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ fontSize: '10px', color: t.textMuted, fontWeight: '700', marginBottom: '2px', display: 'block' }}>Category</label>
                            <select
                              value={newCustomPriceDraft.service}
                              onChange={e => setNewCustomPriceDraft({ ...newCustomPriceDraft, service: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '8px',
                                background: isDark ? '#1E293B' : '#FFFFFF',
                                border: `1px solid ${t.cardBorder}`,
                                color: t.textTitle,
                                fontSize: '11.5px',
                                fontWeight: '600',
                                outline: 'none'
                              }}
                            >
                              <option value="Dry Clean">Dry Clean</option>
                              <option value="Wash & Fold">Wash & Fold</option>
                              <option value="Steam Press">Steam Press</option>
                              <option value="Shoe Spa">Shoe Spa</option>
                              <option value="Bag Spa">Bag Spa</option>
                              <option value="Home Care">Home Care</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: '10px', color: t.textMuted, fontWeight: '700', marginBottom: '2px', display: 'block' }}>Price (₹)</label>
                            <input
                              type="number"
                              placeholder="249"
                              value={newCustomPriceDraft.price}
                              onChange={e => setNewCustomPriceDraft({ ...newCustomPriceDraft, price: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '8px',
                                background: isDark ? '#1E293B' : '#FFFFFF',
                                border: `1px solid ${t.cardBorder}`,
                                color: 'var(--primary-green)',
                                fontSize: '12px',
                                fontWeight: '800',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '10px', color: t.textMuted, fontWeight: '700', marginBottom: '2px', display: 'block' }}>Unit</label>
                            <select
                              value={newCustomPriceDraft.unit}
                              onChange={e => setNewCustomPriceDraft({ ...newCustomPriceDraft, unit: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '8px',
                                background: isDark ? '#1E293B' : '#FFFFFF',
                                border: `1px solid ${t.cardBorder}`,
                                color: t.textTitle,
                                fontSize: '11.5px',
                                fontWeight: '600',
                                outline: 'none'
                              }}
                            >
                              <option value="/ pc">/ pc</option>
                              <option value="/ kg">/ kg</option>
                              <option value="/ pair">/ pair</option>
                              <option value="/ suit">/ suit</option>
                              <option value="/ panel">/ panel</option>
                              <option value="/ saree">/ saree</option>
                              <option value="/ item">/ item</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setShowAddCustomPriceItem(false)}
                            style={{
                              padding: '7px 12px',
                              borderRadius: '8px',
                              background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
                              border: 'none',
                              color: t.textTitle,
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newCustomPriceDraft.name.trim()) return;
                              const newItem = {
                                id: `custom_${Date.now()}`,
                                name: newCustomPriceDraft.name.trim(),
                                service: newCustomPriceDraft.service,
                                serviceKey: newCustomPriceDraft.service.toLowerCase().replace(/\s+/g, '_'),
                                category: newCustomPriceDraft.service.toLowerCase().replace(/\s+/g, '_'),
                                audience: 'All',
                                price: Number(newCustomPriceDraft.price) || 99,
                                unit: newCustomPriceDraft.unit || '/ pc',
                                desc: `Custom studio service for ${newCustomPriceDraft.name.trim()}`
                              };
                              setStoreFormData(prev => ({
                                ...prev,
                                priceList: [...(prev.priceList || DEFAULT_STUDIO_PRICE_ITEMS), newItem]
                              }));
                              setNewCustomPriceDraft({ name: '', service: 'Dry Clean', price: 249, unit: '/ pc' });
                              setShowAddCustomPriceItem(false);
                            }}
                            style={{
                              padding: '7px 14px',
                              borderRadius: '8px',
                              background: 'var(--primary-green)',
                              border: 'none',
                              color: '#FFF',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Add to Studio List
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '6px' }}>
                      {!showAddCustomPriceItem && (
                        <button
                          type="button"
                          onClick={() => setShowAddCustomPriceItem(true)}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3B82F6',
                            fontSize: '11.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Plus size={13} /> Add Custom Item
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setStoreFormData(prev => ({
                            ...prev,
                            priceList: JSON.parse(JSON.stringify(DEFAULT_STUDIO_PRICE_ITEMS))
                          }));
                          setShowAddCustomPriceItem(false);
                        }}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '8px',
                          background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                          border: `1px solid ${t.cardBorder}`,
                          color: t.textMuted,
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ↺ Reset to National Catalog
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingStore}
                className="btn-primary"
                style={{
                  padding: '14px',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  opacity: isSubmittingStore ? 0.7 : 1,
                  cursor: isSubmittingStore ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmittingStore ? (
                  <>Saving to MongoDB Atlas...</>
                ) : editingStore ? (
                  <>Save Studio Changes ✓</>
                ) : (
                  <>Register & Launch Studio in Atlas 🚀</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ── MODAL: CONFIRM DELETE STORE POPUP ───────────────────────────────── */}
      {storeToDelete && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div 
            className="bottom-sheet animate-fade-in" 
            style={{ 
              padding: '24px', 
              maxWidth: '460px', 
              background: isDark ? '#0F172A' : '#FFFFFF', 
              color: t.textTitle, 
              borderRadius: '24px',
              border: `1.5px solid ${isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.25)'}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trash2 size={22} color="#EF4444" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: '#EF4444' }}>
                  Delete Franchise Studio
                </h3>
                <div style={{ fontSize: '12px', color: t.textMuted }}>
                  Confirm deletion from MongoDB Atlas network
                </div>
              </div>
              <button 
                className="btn-icon" 
                onClick={() => setStoreToDelete(null)}
                style={{ color: t.textMuted }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
              border: `1px solid ${t.cardBorder}`,
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 10px 0', color: t.textTitle, lineHeight: 1.4 }}>
                Do you want to delete <span style={{ color: '#EF4444' }}>"{storeToDelete.name}"</span>?
              </p>
              <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 4px 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                📍 <span>{storeToDelete.address || 'Address not specified'}</span>
              </p>
              <p style={{ fontSize: '11px', color: t.textMuted, margin: 0 }}>
                🏙️ {storeToDelete.city}, {storeToDelete.state}
              </p>
            </div>

            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '11.5px',
              color: '#F87171',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={15} flexShrink={0} />
              <span>This studio will be permanently removed from MongoDB Atlas and cannot be recovered.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStoreToDelete(null)}
                disabled={isDeletingStore}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
                  border: `1px solid ${t.cardBorder}`,
                  color: t.textTitle,
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                id="btn-confirm-delete-store"
                onClick={handleConfirmDeleteStore}
                disabled={isDeletingStore}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#EF4444',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: isDeletingStore ? 'not-allowed' : 'pointer',
                  opacity: isDeletingStore ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                }}
              >
                {isDeletingStore ? (
                  'Deleting from Atlas...'
                ) : (
                  <>
                    <Trash2 size={14} /> Delete Studio
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: MANAGE STORE PRICE LIST (MONGODB ATLAS SYNCED) ───────────── */}
      {selectedStoreForPriceList && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div 
            className="bottom-sheet animate-fade-in" 
            style={{ 
              padding: '24px', 
              maxWidth: '640px', 
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              background: isDark ? '#0F172A' : '#FFFFFF', 
              color: t.textTitle, 
              borderRadius: '24px',
              border: `1.5px solid ${isDark ? 'rgba(39, 162, 67, 0.4)' : 'rgba(39, 162, 67, 0.3)'}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="sheet-handle" />

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(39, 162, 67, 0.15)',
                  border: '1px solid rgba(39, 162, 67, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Tag size={22} color="var(--primary-green)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: t.textTitle }}>
                    Price List: {selectedStoreForPriceList.name}
                  </h3>
                  <div style={{ fontSize: '11.5px', color: t.textMuted, marginTop: '2px' }}>
                    📍 {selectedStoreForPriceList.city}, {selectedStoreForPriceList.state} · Dedicated Studio Rates
                  </div>
                </div>
              </div>
              <button 
                className="btn-icon" 
                onClick={() => setSelectedStoreForPriceList(null)}
                style={{ color: t.textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Controls: Search + Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: t.textMuted }} />
                  <input
                    type="text"
                    placeholder="Search price list items (e.g. Suit, Saree, Shoes)..."
                    value={priceListSearch}
                    onChange={e => setPriceListSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: '10px',
                      border: `1px solid ${t.cardBorder}`,
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC',
                      color: t.textTitle,
                      fontSize: '12.5px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button
                  type="button"
                  id="btn-show-add-price-item"
                  onClick={() => setShowNewPriceItemForm(!showNewPriceItemForm)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'var(--primary-green)',
                    border: 'none',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    flexShrink: 0
                  }}
                >
                  <Plus size={14} /> + New Item
                </button>
                <button
                  type="button"
                  onClick={handleResetToStandardCatalog}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    border: `1px solid ${t.cardBorder}`,
                    color: t.textMuted,
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  title="Reset to Cleanz24 standard catalog"
                >
                  ↺ Reset
                </button>
              </div>

              {/* Service Category Filters */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['all', 'Wash & Fold', 'Dry Clean', 'Steam Press', 'Shoe Spa', 'Household'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPriceListFilterCategory(cat)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: 'none',
                      background: priceListFilterCategory === cat 
                        ? 'var(--primary-green)' 
                        : (isDark ? 'rgba(255, 255, 255, 0.07)' : '#F1F5F9'),
                      color: priceListFilterCategory === cat ? '#FFF' : t.textMuted,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat === 'all' ? `All (${priceListItems.length})` : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inline Add New Price Item Form */}
            {showNewPriceItemForm && (
              <form onSubmit={handleAddNewPriceItem} style={{
                background: isDark ? 'rgba(39, 162, 67, 0.08)' : '#F0FDF4',
                border: '1px solid rgba(39, 162, 67, 0.3)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-green)' }}>
                  Add Custom Item to {selectedStoreForPriceList.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Item Name (e.g. Silk Kurta)"
                    value={newPriceItemInput.name}
                    onChange={e => setNewPriceItemInput({ ...newPriceItemInput, name: e.target.value })}
                    required
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${t.cardBorder}`,
                      background: isDark ? '#1E293B' : '#FFFFFF',
                      color: t.textTitle,
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <select
                    value={newPriceItemInput.service}
                    onChange={e => setNewPriceItemInput({ ...newPriceItemInput, service: e.target.value })}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: `1px solid ${t.cardBorder}`,
                      background: isDark ? '#1E293B' : '#FFFFFF',
                      color: t.textTitle,
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="Wash & Fold">Wash & Fold</option>
                    <option value="Dry Clean">Dry Clean</option>
                    <option value="Steam Press">Steam Press</option>
                    <option value="Shoe Spa">Shoe Spa</option>
                    <option value="Household">Household</option>
                  </select>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: t.textTitle }}>₹</span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={newPriceItemInput.price}
                      onChange={e => setNewPriceItemInput({ ...newPriceItemInput, price: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: `1px solid ${t.cardBorder}`,
                        background: isDark ? '#1E293B' : '#FFFFFF',
                        color: 'var(--primary-green)',
                        fontSize: '12px',
                        fontWeight: '800',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <select
                    value={newPriceItemInput.unit}
                    onChange={e => setNewPriceItemInput({ ...newPriceItemInput, unit: e.target.value })}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: `1px solid ${t.cardBorder}`,
                      background: isDark ? '#1E293B' : '#FFFFFF',
                      color: t.textTitle,
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="/ pc">/ pc</option>
                    <option value="/ kg">/ kg</option>
                    <option value="/ suit">/ suit</option>
                    <option value="/ saree">/ saree</option>
                    <option value="/ pair">/ pair</option>
                    <option value="/ item">/ item</option>
                    <option value="/ panel">/ panel</option>
                    <option value="/ set">/ set</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewPriceItemForm(false)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'none',
                      border: `1px solid ${t.cardBorder}`,
                      color: t.textMuted,
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="btn-confirm-add-price-item"
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      background: 'var(--primary-green)',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Price List ✓
                  </button>
                </div>
              </form>
            )}

            {/* Scrollable Price Items List */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              maxHeight: '400px',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              paddingRight: '4px' 
            }}>
              {priceListItems
                .filter(item => {
                  const matchesSearch = !priceListSearch || 
                    item.name.toLowerCase().includes(priceListSearch.toLowerCase()) ||
                    (item.service && item.service.toLowerCase().includes(priceListSearch.toLowerCase()));
                  const matchesCategory = priceListFilterCategory === 'all' || 
                    (item.service && item.service.toLowerCase().includes(priceListFilterCategory.toLowerCase())) ||
                    (item.category && item.category.toLowerCase().includes(priceListFilterCategory.toLowerCase()));
                  return matchesSearch && matchesCategory;
                })
                .map((item, idx) => (
                  <div key={item.id || idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                    border: `1px solid ${t.cardBorder}`,
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: t.textTitle }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '3px' }}>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: 'rgba(39, 162, 67, 0.12)',
                          color: 'var(--primary-green)'
                        }}>
                          {item.service || 'Laundry'}
                        </span>
                        {item.audience && (
                          <span style={{ fontSize: '9.5px', color: t.textMuted }}>
                            • {item.audience}
                          </span>
                        )}
                        {item.desc && (
                          <span style={{ fontSize: '10px', color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            • {item.desc}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: t.textTitle }}>₹</span>
                      <input
                        type="number"
                        value={item.price}
                        onChange={e => handleUpdateItemPrice(item.id, e.target.value)}
                        style={{
                          width: '74px',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          border: `1px solid ${t.cardBorder}`,
                          background: isDark ? '#1E293B' : '#FFFFFF',
                          color: 'var(--primary-green)',
                          fontSize: '14px',
                          fontWeight: '800',
                          textAlign: 'right',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: t.textMuted, width: '42px' }}>
                        {item.unit || '/ pc'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePriceItem(item.id)}
                        style={{
                          padding: '6px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer'
                        }}
                        title="Delete Item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

              {priceListItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: t.textMuted, fontSize: '13px' }}>
                  No items in price list. Click "↺ Reset" to load the standard Cleanz24 catalog.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '16px', 
              paddingTop: '14px', 
              borderTop: `1px solid ${t.cardBorder}` 
            }}>
              <span style={{ fontSize: '12px', color: t.textMuted }}>
                Total <strong>{priceListItems.length}</strong> items in this store's price list
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStoreForPriceList(null)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
                    border: `1px solid ${t.cardBorder}`,
                    color: t.textTitle,
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="btn-save-store-pricelist"
                  onClick={handleSavePriceListToBackend}
                  disabled={isSavingPriceList}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'var(--primary-green)',
                    border: 'none',
                    color: '#FFF',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: isSavingPriceList ? 'not-allowed' : 'pointer',
                    opacity: isSavingPriceList ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(39, 162, 67, 0.3)'
                  }}
                >
                  {isSavingPriceList ? (
                    'Saving to MongoDB Atlas...'
                  ) : (
                    <>
                      <Check size={15} /> Save Price List to MongoDB Atlas 🚀
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
