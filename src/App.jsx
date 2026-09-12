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
import { Smartphone, Monitor, ShieldCheck, X, Sun, Moon } from 'lucide-react';

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

  const notificationsList = [
    { id: 1, title: 'Valet Dispatched 🚗', text: 'David Santos is en route to pick up your laundry bag.', time: '10m ago' },
    { id: 2, title: '20% OFF Promo Applied 🎉', text: 'Promo code CLEANZ20 saved you Rs. 120 on your last order.', time: '2h ago' }
  ];

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
              activeNotificationsCount={notificationsList.length}
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
          <div style={{
            position: 'absolute',
            top: '70px',
            right: '18px',
            width: '280px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-active)',
            borderRadius: '16px',
            padding: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            zIndex: 1500
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700' }}>Notifications</div>
              <button className="btn-icon" onClick={() => setShowNotifications(false)} style={{ width: '24px', height: '24px' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notificationsList.map(n => (
                <div key={n.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '12px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary-green)' }}>{n.title}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{n.text}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-subtle)', marginTop: '4px' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
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
