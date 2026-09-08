import React from 'react';
import { Home, Shirt, CreditCard, User, MapPin } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: Shirt },
    { id: 'stores', label: 'Stores', icon: MapPin },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
    { id: 'profile', label: 'Account', icon: User }
  ];

  return (
    <nav style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '76px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px 12px 8px',
      zIndex: 1000
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: isActive ? 'var(--primary-green)' : 'var(--text-muted)',
              cursor: 'pointer',
              flex: 1,
              position: 'relative',
              transition: 'all 0.2s ease',
              padding: '6px 0'
            }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '28px',
              borderRadius: '14px',
              background: isActive ? 'rgba(39, 162, 67, 0.18)' : 'transparent',
              transition: 'background 0.2s ease'
            }}>
              <Icon size={20} color={isActive ? 'var(--primary-green)' : 'var(--text-muted)'} />
              
              {tab.badge && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '2px',
                  background: 'linear-gradient(135deg, #3C8B35, #27A243)',
                  color: '#FFF',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 5px',
                  borderRadius: '10px',
                  lineHeight: 1
                }}>
                  {tab.badge}
                </span>
              )}
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? '700' : '500',
              letterSpacing: '-0.2px'
            }}>
              {tab.label}
            </span>

            {/* Glowing Dot indicator for active tab */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: '2px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--primary-green)',
                boxShadow: '0 0 6px var(--primary-green)'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
