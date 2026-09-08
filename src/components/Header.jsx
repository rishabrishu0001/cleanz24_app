import React from 'react';
import { MapPin, Bell, Sun, Moon, Navigation, ChevronDown, User, UserCheck } from 'lucide-react';

export default function Header({ 
  location, 
  darkMode, 
  setDarkMode, 
  activeNotificationsCount,
  onOpenNotifications,
  onOpenLocationPicker,
  onOpenAuthModal,
  currentUser
}) {
  return (
    <header style={{
      padding: '14px 18px 10px 18px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      {/* Official Cleanz24 Brand Logo & Clickable Location */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="/images/logo.jpg" 
            alt="Cleanz24 The Dry Clean Studio" 
            style={{ 
              height: '48px',
              width: 'auto',
              maxWidth: '180px',
              borderRadius: '0', 
              objectFit: 'contain',
              display: 'block'
            }} 
          />
        </div>
        
        {/* Clickable Location Pill */}
        <div 
          onClick={onOpenLocationPicker}
          className="interactive"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontSize: '11px', 
            color: 'var(--text-main)',
            marginTop: '2px',
            cursor: 'pointer',
            padding: '3px 8px 3px 6px',
            borderRadius: '20px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-active)',
            maxWidth: 'fit-content',
            transition: 'all 0.2s ease'
          }}
          title="Click to search or change location"
        >
          <Navigation size={11} color="var(--primary-green)" style={{ flexShrink: 0 }} />
          <span style={{ 
            maxWidth: '170px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap', 
            fontWeight: '700',
            color: 'var(--text-main)'
          }}>
            {location}
          </span>
          <ChevronDown size={11} color="var(--primary-green)" style={{ flexShrink: 0 }} />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Quick Sign In / Sign Up Button */}
        <button
          onClick={onOpenAuthModal}
          style={{
            padding: '5px 10px',
            borderRadius: '20px',
            background: currentUser?.isLoggedIn ? 'rgba(39, 162, 67, 0.15)' : 'linear-gradient(135deg, #15803D, #22C55E)',
            border: currentUser?.isLoggedIn ? '1px solid rgba(39, 162, 67, 0.4)' : 'none',
            color: currentUser?.isLoggedIn ? 'var(--primary-green)' : '#FFFFFF',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: currentUser?.isLoggedIn ? 'none' : '0 2px 8px rgba(34, 197, 94, 0.3)'
          }}
          title={currentUser?.isLoggedIn ? `Go to Profile (${currentUser.name || 'User'})` : "Sign In or Register"}
        >
          {currentUser?.isLoggedIn ? <UserCheck size={13} /> : <User size={13} />}
          <span>{currentUser?.isLoggedIn ? (currentUser.name && currentUser.name !== 'Customer' ? currentUser.name.split(' ')[0] : 'My Profile') : 'Sign In'}</span>
        </button>

        {/* Dark/Light Mode Toggle */}
        <button 
          className="btn-icon" 
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          style={{ width: '34px', height: '34px' }}
        >
          {darkMode ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="#27A243" />}
        </button>

        {/* Notifications Icon with Badge */}
        <button 
          className="btn-icon" 
          onClick={onOpenNotifications}
          style={{ width: '34px', height: '34px', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={17} />
          {activeNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--primary-green)',
              boxShadow: '0 0 8px var(--primary-green)'
            }} />
          )}
        </button>
      </div>
    </header>
  );
}


