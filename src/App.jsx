import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import ServicesScreen from './screens/ServicesScreen.jsx';
import BookingModal from './screens/BookingModal.jsx';
import WalletScreen from './screens/WalletScreen.jsx';
import StoresScreen from './screens/StoresScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import AdminPanel from './screens/AdminPanel.jsx';
import SupportChatModal from './components/SupportChatModal.jsx';
import LocationPickerModal from './components/LocationPickerModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import OnboardingFlow from './components/OnboardingFlow.jsx';
import LocationPermissionScreen from './components/LocationPermissionScreen.jsx';
import api from './services/api.js';
import { findNearestStore, getStudioKeyForStore } from './services/storeCatalogs.js';
import { Smartphone, Monitor, ShieldCheck, X, Sun, Moon, Bell, CheckCheck, Trash2 } from 'lucide-react';

export default function App() {
  // Onboarding — disabled by default to avoid intrusive green screen
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Navigation & Viewport State
  const [activeTab, setActiveTab] = useState('home');
  const [expandedView, setExpandedView] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState('Sector 94, Noida');
  const [userCoords, setUserCoords] = useState({ lat: 28.5445, lng: 77.3292 });
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Auto-resolve nearest studio based on user's location (defaults to Noida 41, NOT Siwara!)
  const initialNearest = findNearestStore({ lat: 28.5445, lng: 77.3292 }, 'Sector 94, Noida');
  const [selectedStudio, setSelectedStudio] = useState(initialNearest.studioKey || 'noida41'); // shared across Home & Services

  // Show Blinkit-style location permission screen on first launch
  const [showLocationPermission, setShowLocationPermission] = useState(
    !localStorage.getItem('cleanz24_location_granted')
  );

  // Helper to load persisted user from localStorage
  const getInitialUser = () => {
    try {
      const saved = localStorage.getItem('cleanz24_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.isLoggedIn || parsed.isGuest) && parsed.name) {
          return parsed;
        }
      }
    } catch {
      // Ignore errors
    }
    return null;
  };

  const initialUser = getInitialUser();

  // User Auth State — default to unauthenticated if not logged in and not guest
  const [currentUser, setCurrentUser] = useState(initialUser || {
    name: '',
    phone: '',
    email: '',
    isLoggedIn: false,
    isGuest: false
  });

  // Controls whether user has entered app (via login or guest)
  const isUserEntered = !!(currentUser?.isLoggedIn || currentUser?.isGuest);

  // In-app auth modal (opened from Header / Booking when guest clicks Sign In)
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLocationSelect = (newLocation, coords) => {
    setUserLocation(newLocation);
    const updatedCoords = coords || userCoords;
    if (coords) setUserCoords(coords);

    // Automatically resolve nearest store & sync price list catalog
    const nearest = findNearestStore(updatedCoords, newLocation);
    if (nearest && nearest.studioKey) {
      setSelectedStudio(nearest.studioKey);
    }
  };

  const handleLoginSuccess = async (userData) => {
    if (userData?.isGuest) {
      const guestUser = {
        id: 'guest_' + Date.now(),
        name: 'Guest User',
        phone: '',
        email: '',
        isLoggedIn: false,
        isGuest: true
      };
      setCurrentUser(guestUser);
      localStorage.setItem('cleanz24_user', JSON.stringify(guestUser));
      setShowAuthModal(false);
      setActiveTab('home');
      return;
    }

    try {
      const res = await api.auth.login(userData);
      const user = res.user || userData;
      const finalUser = {
        ...user,
        name: userData.name || user.name || 'Customer',
        phone: userData.phone || user.phone,
        email: userData.email || user.email,
        isLoggedIn: true,
        isGuest: false
      };
      setCurrentUser(finalUser);
      localStorage.setItem('cleanz24_user', JSON.stringify(finalUser));
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        handleLocationSelect(addr.address, addr.lat && addr.lng ? { lat: addr.lat, lng: addr.lng } : null);
      }
    } catch {
      const fallbackUser = {
        ...userData,
        name: userData.name || 'Customer',
        isLoggedIn: true,
        isGuest: false
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('cleanz24_user', JSON.stringify(fallbackUser));
    }
    if (userData.address) {
      handleLocationSelect(userData.address);
    }
    setShowAuthModal(false);
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('cleanz24_user');
    setCurrentUser({
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false,
      isGuest: false
    });
    setShowAuthModal(false);
    setActiveTab('profile');
  };

  // ── Automatic Session Check ────────────────────────────────────────────────
  // If admin deletes the customer from the dashboard, automatically log them out
  // from their phone and prompt them to re-register as a brand new customer!
  useEffect(() => {
    if (!currentUser?.isLoggedIn || currentUser?.isGuest) return;

    let isMounted = true;

    const handleForceLogout = () => {
      localStorage.removeItem('cleanz24_user');
      setCurrentUser({
        name: '',
        phone: '',
        email: '',
        isLoggedIn: false,
        isGuest: false
      });
      setActiveTab('profile');
      setShowAuthModal(false);
      window.alert('Aapka account administrator dwaara delete kar diya gaya hai. Kripya naye user ki tarah register karein.');
    };

    const verifySession = async () => {
      try {
        const res = await api.auth.getMe(currentUser.id, currentUser.phone);
        if (!res?.exists && isMounted) {
          console.warn('[Cleanz24] User deleted in backend. Auto-logging out...');
          handleForceLogout();
        }
      } catch (err) {
        if (err.message && (err.message.includes('404') || err.message.includes('deleted') || err.message.includes('not exist') || err.message.includes('not found'))) {
          if (isMounted) {
            console.warn('[Cleanz24] User deleted in backend. Auto-logging out...');
            handleForceLogout();
          }
        }
      }
    };

    // 1. Initial check
    verifySession();

    // 2. Periodic heartbeat check every 10 seconds
    const heartbeatTimer = setInterval(verifySession, 10000);

    // 3. Check when user switches to or wakes up the app
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        verifySession();
      }
    };
    window.addEventListener('focus', verifySession);
    document.addEventListener('visibilitychange', handleVisibility);

    // 4. Instant cross-component event if deleted in the same browser session
    const handleUserDeleted = (e) => {
      const deletedPhone = e.detail?.phone?.replace(/\D/g, '').slice(-10);
      const currentPhone = currentUser.phone?.replace(/\D/g, '').slice(-10);
      const deletedId = e.detail?.id;
      if ((deletedPhone && currentPhone && deletedPhone === currentPhone) || (deletedId && deletedId === currentUser.id)) {
        handleForceLogout();
      }
    };
    window.addEventListener('cleanz24_user_deleted', handleUserDeleted);

    return () => {
      isMounted = false;
      clearInterval(heartbeatTimer);
      window.removeEventListener('focus', verifySession);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('cleanz24_user_deleted', handleUserDeleted);
    };
  }, [currentUser?.id, currentUser?.phone, currentUser?.isLoggedIn]);

  // Application Data States (Prices in Indian Rupees - Rs.)
  const [cart, setCart] = useState({
    'wf_bag': {
      id: 'wf_bag',
      name: 'Standard Wash & Fold Bag',
      price: 49,
      unit: '/ kg',
      quantity: 5,
      image: '/images/hero.jpg'
    },
    'dc_suit': {
      id: 'dc_suit',
      name: '2-Piece Men / Women Suit',
      price: 399,
      unit: '/ suit',
      quantity: 1,
      image: '/images/drycleaning.jpg'
    }
  });

  const [activeOrder, setActiveOrder] = useState(null);

  // Modal Overlays
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedStoreForBooking, setSelectedStoreForBooking] = useState(null);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 1,
      title: 'Valet Assigned for Doorstep Pickup 🛵',
      text: 'Ramesh Kumar (Cleanz Valet #14) is en route to collect your garments from Sector 94, Noida.',
      time: '5m ago',
      unread: true,
      badge: 'Pickup',
      badgeColor: '#10B981',
      actionTab: 'orders',
      actionText: 'Track Valet →'
    },
    {
      id: 2,
      title: '🎉 Grand Opening: Cyber Hub Studio',
      text: 'New studio launching Oct 25! Enjoy Flat 20% OFF on your first walk-in order + Free Shoe Spa.',
      time: '25m ago',
      unread: true,
      badge: 'New Store',
      badgeColor: '#F59E0B',
      actionTab: 'stores',
      actionText: 'View Studio →'
    },
    {
      id: 3,
      title: 'Flat 20% OFF Promo Applied 🎁',
      text: 'Promo code CLEANZ20 applied successfully! Saved ₹120 on your dry cleaning order.',
      time: '2h ago',
      unread: false,
      badge: 'Offer',
      badgeColor: '#EC4899',
      actionTab: 'services',
      actionText: 'Book Service →'
    },
    {
      id: 4,
      title: 'Steam Press & QC Passed 👔',
      text: 'Your garments have cleared Italian 3-stage steam pressing and fabric sanitization checks.',
      time: 'Yesterday',
      unread: false,
      badge: 'QC Passed',
      badgeColor: '#3B82F6',
      actionTab: 'orders',
      actionText: 'View Order →'
    },
    {
      id: 5,
      title: '₹150 Wallet Bonus Credited 💰',
      text: 'Welcome cash bonus credited to your Cleanz24 Wallet. Use it for your next booking.',
      time: '2 days ago',
      unread: false,
      badge: 'Cashback',
      badgeColor: '#8B5CF6',
      actionTab: 'wallet',
      actionText: 'Open Wallet →'
    }
  ];

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleDismissNotification = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (n) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
    if (n.actionTab) {
      setActiveTab(n.actionTab);
    }
    setShowNotifications(false);
  };

  // Sync Dark/Light theme class
  useEffect(() => {
    if (!darkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [darkMode]);

  // Fetch initial active order from backend
  useEffect(() => {
    api.orders.getActive(currentUser?.id)
      .then(res => {
        if (res.order) {
          setActiveOrder(res.order);
        }
      })
      .catch(() => {
        console.log('Using local fallback order');
      });
  }, [currentUser?.id]);

  // Handle completed booking from modal
  const handleBookingComplete = async (newOrder) => {
    setActiveOrder(newOrder);
    setShowBookingModal(false);
    setSelectedStoreForBooking(null);
    setCart({}); // Reset cart
    setActiveTab('home'); // Switch to home tab

    try {
      const payload = {
        userId: currentUser?.id || 'usr_guest',
        customerName: currentUser?.name || 'Customer',
        customerPhone: currentUser?.phone || '',
        items: Object.values(cart),
        pickupDate: newOrder.pickupDate || 'Today',
        pickupSlot: newOrder.pickupSlot || '11:30 AM',
        address: newOrder.address || userLocation,
        storeName: newOrder.storeName || 'Cleanz24 - Sector 41 Noida',
        storeAddress: newOrder.storeAddress || '',
        totalPrice: newOrder.totalPrice || 245,
        paymentMethod: newOrder.paymentMethod || 'UPI / COD'
      };
      const res = await api.orders.create(payload);
      if (res.order) {
        setActiveOrder(res.order);
      }
    } catch (err) {
      console.warn('Order saved locally (server sync fallback):', err.message);
    }
  };

  return (
    <div className="app-container">
      {/* Blinkit-style Location Permission Screen — shown once on first launch */}
      {showLocationPermission && (
        <LocationPermissionScreen
          onLocationDetected={(locationStr, gpsCoords) => {
            handleLocationSelect(locationStr, gpsCoords);
            setShowLocationPermission(false);
          }}
          onSkip={() => {
            localStorage.setItem('cleanz24_location_granted', '1');
            setShowLocationPermission(false);
          }}
        />
      )}

      {/* Onboarding — shown only on first visit */}
      {showOnboarding && !showLocationPermission && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}
      
      {/* Top Device Switcher Bar for Web Preview */}
      <div className={`view-control-bar ${expandedView ? 'expanded' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
          <span style={{ color: 'var(--primary-green)' }}>
            {showAdminPanel ? '👑 Cleanz24 Control Center' : 'Cleanz24 Eco App Preview'}
          </span>
          <span className={`badge ${showAdminPanel ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '10px' }}>
            {showAdminPanel ? 'ADMIN PORTAL' : 'INR Pricing (Rs.)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Day / Night Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: darkMode ? '#FBBF24' : '#0284C7',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            title="Toggle Day / Night Mode"
          >
            {darkMode ? <Sun size={14} color="#FBBF24" /> : <Moon size={14} color="#0284C7" />}
            <span>{darkMode ? '☀️ Day' : '🌙 Night'}</span>
          </button>

          <button
            onClick={() => setExpandedView(false)}
            style={{
              background: !expandedView ? 'var(--primary-green)' : 'transparent',
              color: !expandedView ? '#FFF' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '10px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Smartphone size={14} /> Mobile View
          </button>

          <button
            onClick={() => setExpandedView(true)}
            style={{
              background: expandedView ? 'var(--primary-green)' : 'transparent',
              color: expandedView ? '#FFF' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '10px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Monitor size={14} /> Desktop View
          </button>

          {!showAdminPanel ? (
            <button
              onClick={() => setShowAdminPanel(true)}
              style={{
                background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                color: '#F59E0B',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)'
              }}
            >
              <ShieldCheck size={14} color="#F59E0B" /> 👑 Admin Portal
            </button>
          ) : (
            <button
              onClick={() => setShowAdminPanel(false)}
              style={{
                background: 'rgba(39, 162, 67, 0.15)',
                color: 'var(--primary-green)',
                border: '1px solid rgba(39, 162, 67, 0.4)',
                borderRadius: '10px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Smartphone size={14} /> 📱 Customer App
            </button>
          )}
        </div>
      </div>

      {/* Main Mobile Device Shell / Frame */}
      <div 
        className={`device-shell ${expandedView ? 'expanded-view' : ''}`} 
        style={{ 
          background: showAdminPanel ? (darkMode ? '#0B0F14' : '#F8FAFC') : undefined, 
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto' 
        }}
      >
        
        {/* Mobile Camera Notch (Only in Mobile Frame mode) */}
        {!expandedView && (
          <div className="device-notch">
            <div className="camera-lens" />
          </div>
        )}

        {/* If Admin Panel is Active, show Admin Panel inside device shell */}
        {showAdminPanel ? (
          <AdminPanel onExitToApp={() => setShowAdminPanel(false)} darkMode={darkMode} setDarkMode={setDarkMode} />
        ) : (
          <>
            {/* Header Component */}
            <Header 
              location={userLocation}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              activeNotificationsCount={unreadNotificationsCount}
              onOpenNotifications={() => setShowNotifications(!showNotifications)}
              onOpenLocationPicker={() => setShowLocationPicker(true)}
              onOpenAuthModal={() => {
                setActiveTab('profile');
                setShowAuthModal(false);
              }}
              currentUser={currentUser}
            />

            {/* Screen Content Container */}
            <main className="screen-content">
              {!isUserEntered ? (
                <ProfileScreen 
                  onOpenChat={() => setShowSupportChat(true)}
                  onStartBooking={() => setShowBookingModal(true)}
                  onOpenAdmin={() => setShowAdminPanel(true)}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  onLogout={handleLogout}
                  onOpenAuthModal={() => setActiveTab('profile')}
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateTab={setActiveTab}
                />
              ) : (
                <>
                  {activeTab === 'home' && (
                    <HomeScreen 
                      onStartBooking={() => setShowBookingModal(true)}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                      activeOrder={activeOrder}
                      currentUser={currentUser}
                      userName={currentUser?.name ? currentUser.name.split(' ')[0] : 'Guest'}
                      onOpenAuthModal={() => {
                        setActiveTab('profile');
                        setShowAuthModal(false);
                      }}
                      selectedStudio={selectedStudio}
                      onStudioChange={(key) => setSelectedStudio(key)}
                      userCoords={userCoords}
                      userLocation={userLocation}
                      onRequestLocation={() => setShowLocationPicker(true)}
                    />
                  )}

                  {activeTab === 'services' && (
                    <ServicesScreen 
                      cart={cart}
                      setCart={setCart}
                      onProceedToBooking={() => setShowBookingModal(true)}
                      selectedStudio={selectedStudio}
                      onStudioChange={(key) => setSelectedStudio(key)}
                      userLocation={userLocation}
                      userCoords={userCoords}
                      onOpenLocationPicker={() => setShowLocationPicker(true)}
                    />
                  )}

                  {activeTab === 'stores' && (
                    <StoresScreen 
                      userCoords={userCoords}
                      setUserCoords={setUserCoords}
                      userLocation={userLocation}
                      onOpenLocationPicker={() => setShowLocationPicker(true)}
                      onStartBooking={(selectedStore) => {
                        if (selectedStore) {
                          setSelectedStoreForBooking(selectedStore);
                          handleLocationSelect(selectedStore.address || selectedStore.name, selectedStore.lat && selectedStore.lng ? { lat: selectedStore.lat, lng: selectedStore.lng } : null);
                        }
                        setShowBookingModal(true);
                      }}
                      onLocationDetected={(locationString) => {
                        handleLocationSelect(locationString);
                      }}
                    />
                  )}

                  {activeTab === 'wallet' && (
                    <WalletScreen 
                      onStartBooking={() => setShowBookingModal(true)}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <ProfileScreen 
                      onOpenChat={() => setShowSupportChat(true)}
                      onStartBooking={() => setShowBookingModal(true)}
                      onOpenAdmin={() => setShowAdminPanel(true)}
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      onLogout={handleLogout}
                      onOpenAuthModal={() => setActiveTab('profile')}
                      onLoginSuccess={handleLoginSuccess}
                      onNavigateTab={setActiveTab}
                    />
                  )}
                </>
              )}
            </main>

        {/* Notifications Drawer Overlay */}
        {showNotifications && (
          <>
            {/* Backdrop click-to-close */}
            <div 
              id="notif-backdrop"
              onClick={() => setShowNotifications(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1490,
                background: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(2px)'
              }}
            />

            <div 
              id="notif-popup"
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: '68px',
                right: '12px',
                width: '340px',
                maxWidth: 'calc(100% - 24px)',
                background: darkMode ? '#0F172A' : '#FFFFFF',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '16px',
                boxShadow: darkMode ? '0 15px 40px rgba(0,0,0,0.85)' : '0 15px 35px rgba(15, 23, 42, 0.16)',
                zIndex: 1500,
                maxHeight: '460px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: darkMode ? '#F8FAFC' : '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bell size={16} color="var(--primary-green)" />
                    Notifications
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <span style={{
                      background: 'rgba(39, 162, 67, 0.15)',
                      color: 'var(--primary-green)',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {unreadNotificationsCount} New
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {unreadNotificationsCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotificationsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-green)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: '3px 6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title="Mark all as read"
                    >
                      <CheckCheck size={13} /> Read all
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllNotifications}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: darkMode ? '#94A3B8' : '#64748B',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: '3px 6px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title="Clear all notifications"
                    >
                      <Trash2 size={12} /> Clear
                    </button>
                  )}
                  <button 
                    className="btn-icon" 
                    onClick={() => setShowNotifications(false)} 
                    style={{ width: '26px', height: '26px', color: darkMode ? '#94A3B8' : '#64748B' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px', maxHeight: '360px' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px 12px', color: darkMode ? '#94A3B8' : '#64748B' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: '4px' }}>All Caught Up!</div>
                    <div style={{ fontSize: '11.5px', marginBottom: '14px' }}>You have no new notifications right now.</div>
                    <button
                      type="button"
                      onClick={() => setNotifications(DEFAULT_NOTIFICATIONS)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: darkMode ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                        border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
                        color: darkMode ? '#F1F5F9' : '#334155',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Reset Demo Notifications
                    </button>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: n.unread 
                          ? (darkMode ? 'rgba(39, 162, 67, 0.12)' : '#F0FDF4') 
                          : (darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC'),
                        border: n.unread 
                          ? '1px solid rgba(39, 162, 67, 0.3)' 
                          : (darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0'),
                        borderLeft: n.unread ? '3.5px solid var(--primary-green)' : undefined,
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: '800',
                            padding: '1.5px 6px',
                            borderRadius: '6px',
                            background: `${n.badgeColor || '#10B981'}22`,
                            color: n.badgeColor || '#10B981',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px'
                          }}>
                            {n.badge}
                          </span>
                          <span style={{
                            fontSize: '12.5px',
                            fontWeight: '700',
                            color: darkMode ? '#F8FAFC' : '#0F172A',
                            lineHeight: 1.3
                          }}>
                            {n.title}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDismissNotification(n.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: darkMode ? '#64748B' : '#94A3B8',
                            cursor: 'pointer',
                            padding: '2px',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}
                          title="Dismiss notification"
                        >
                          <X size={12} />
                        </button>
                      </div>

                      <div style={{
                        fontSize: '11.5px',
                        color: darkMode ? '#CBD5E1' : '#475569',
                        lineHeight: 1.4,
                        marginBottom: '6px'
                      }}>
                        {n.text}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: darkMode ? '#64748B' : '#94A3B8', fontWeight: '600' }}>
                          {n.time}
                        </span>
                        {n.actionText && (
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: '800',
                            color: 'var(--primary-green)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            {n.actionText}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Location Search & Selection Modal */}
        {showLocationPicker && (
          <LocationPickerModal
            currentLocation={userLocation}
            onSelectLocation={handleLocationSelect}
            onClose={() => setShowLocationPicker(false)}
          />
        )}

        {/* Booking Wizard Modal */}
        {showBookingModal && (
          <BookingModal 
            cart={cart}
            setCart={setCart}
            location={userLocation}
            selectedStore={selectedStoreForBooking}
            onClose={() => { setShowBookingModal(false); setSelectedStoreForBooking(null); }}
            onCompleteBooking={handleBookingComplete}
          />
        )}

        {/* Support Chat Modal */}
        {showSupportChat && (
          <SupportChatModal 
            onClose={() => setShowSupportChat(false)}
          />
        )}

        {/* Global Auth / Sign In / Sign Up Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onOpenAdmin={() => {
            setShowAuthModal(false);
            setShowAdminPanel(true);
          }}
        />

        {/* Mobile Bottom Navigation Bar */}
        {isUserEntered && (
          <BottomNav 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeOrderCount={activeOrder ? 1 : 0}
          />
        )}
        </>
        )}

      </div>
    </div>
  );
}
