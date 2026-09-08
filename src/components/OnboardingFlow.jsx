import React, { useState } from 'react';
import { MapPin, Bell, ChevronRight, Sparkles } from 'lucide-react';

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goNext = () => {
    setAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 200);
  };

  const finish = () => { localStorage.setItem('cleanz24_onboarded', '1'); onComplete(); };

  const requestLocation = (allow) => {
    if (allow && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {}, { timeout: 5000, enableHighAccuracy: false });
    }
    setTimeout(goNext, 300);
  };

  const requestNotification = async (allow) => {
    if (allow && typeof Notification !== 'undefined') {
      try { await Notification.requestPermission(); } catch(_) {}
    }
    setTimeout(finish, 300);
  };

  const dots = [0, 1, 2];

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'linear-gradient(160deg, #0a1f0d 0%, #163320 50%, #06100a 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end'
  };
  const sheet = {
    width: '100%', maxWidth: '430px',
    background: '#FFFFFF', borderRadius: '28px 28px 0 0',
    padding: '32px 24px 40px',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  };
  const dotRow = (active, color, bg) => (
    React.createElement('div', { style: { display: 'flex', gap: '7px', marginTop: '20px' } },
      dots.map(i => React.createElement('div', {
        key: i,
        style: { width: i === active ? '22px' : '7px', height: '7px', borderRadius: '4px',
          background: i === active ? color : bg, transition: 'all 0.3s ease' }
      }))
    )
  );
  const btn = (label, onClick, primary, color) =>
    React.createElement('button', {
      onClick, key: label,
      style: {
        width: '100%', padding: '14px', borderRadius: '12px',
        border: 'none', background: primary ? (color || '#16A34A') : 'transparent',
        color: primary ? '#FFF' : color || '#374151',
        fontSize: primary ? '16px' : '14px', fontWeight: primary ? '800' : '600',
        cursor: 'pointer', marginBottom: '4px',
        borderBottom: !primary ? '1px solid #F3F4F6' : 'none',
        boxShadow: primary ? '0 6px 20px rgba(0,0,0,0.18)' : 'none'
      }
    }, label);

  // STEP 0 - WELCOME
  if (step === 0) {
    return React.createElement('div', { style: overlay },
      React.createElement('div', { style: { position: 'absolute', top: '10%', left: 0, right: 0, textAlign: 'center', padding: '0 24px' } },
        React.createElement('div', { style: { fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: '700', marginBottom: '14px' } }, 'INDIA\'S LEADING'),
        React.createElement('div', { style: { fontSize: '34px', fontWeight: '900', color: '#FFF', lineHeight: 1.2 } },
          'LAUNDRY & ', React.createElement('br'),
          React.createElement('span', { style: { color: '#4ADE80' } }, 'DRY CLEAN'), React.createElement('br'), 'SERVICE'
        ),
        React.createElement('div', { style: { fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '12px' } }, '500+ Studios across India')
      ),
      React.createElement('div', { style: sheet },
        React.createElement('div', { 
          style: { 
            width: '140px', 
            height: '66px', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '18px', 
            boxShadow: '0 8px 24px rgba(22,163,74,0.3)',
            background: '#15803d',
            border: '2px solid rgba(22,163,74,0.25)',
            padding: '2px'
          } 
        },
          React.createElement('img', {
            src: '/images/logo.jpg',
            alt: 'Cleanz24 - The Dry Clean Studio',
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px',
              display: 'block'
            }
          })
        ),
        React.createElement('div', { style: { fontSize: '24px', fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: '8px' } }, 'Welcome to Cleanz24'),
        React.createElement('div', { style: { fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '28px', lineHeight: 1.6 } },
          'Premium laundry & dry cleaning,', React.createElement('br'), 'delivered to your door.'
        ),
        React.createElement('button', {
          onClick: goNext,
          style: { width: '100%', padding: '15px', borderRadius: '14px', background: 'linear-gradient(135deg,#16A34A,#22C55E)', border: 'none', color: '#FFF', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(34,197,94,0.4)' }
        }, 'Get Started', React.createElement(ChevronRight, { size: 20 })),
        dotRow(0, '#16A34A', '#D1FAE5')
      )
    );
  }

  // STEP 1 - LOCATION
  if (step === 1) {
    return React.createElement('div', { style: overlay },
      React.createElement('div', { style: sheet },
        React.createElement('div', { style: { width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' } },
          React.createElement(MapPin, { size: 30, color: '#2563EB' })
        ),
        React.createElement('div', { style: { fontSize: '20px', fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: '6px' } },
          'Allow Cleanz24 to access', React.createElement('br'), 'your location?'
        ),
        React.createElement('div', { style: { fontSize: '13px', color: '#6B7280', textAlign: 'center', marginBottom: '22px', lineHeight: 1.5 } },
          'We use your location to find the nearest studio and deliver to your address.'
        ),
        React.createElement('div', { style: { display: 'flex', gap: '12px', width: '100%', marginBottom: '20px' } },
          ['Precise', 'Approximate'].map((label, i) =>
            React.createElement('div', {
              key: label, onClick: () => requestLocation(true),
              style: { flex: 1, padding: '14px 10px', borderRadius: '16px', border: i === 0 ? '2.5px solid #2563EB' : '1.5px solid #E5E7EB', background: i === 0 ? '#EFF6FF' : '#F9FAFB', textAlign: 'center', cursor: 'pointer' }
            },
              React.createElement('div', { style: { fontSize: '28px', marginBottom: '6px' } }, i === 0 ? '📍' : '🗺️'),
              React.createElement('div', { style: { fontSize: '13px', fontWeight: '800', color: i === 0 ? '#1D4ED8' : '#374151' } }, label),
              React.createElement('div', { style: { fontSize: '10px', color: '#6B7280', marginTop: '3px', lineHeight: 1.4 } }, i === 0 ? 'Exact address detection' : 'City-level only')
            )
          )
        ),
        ['While using the app', 'Only this time', "Don't allow"].map((label, i) =>
          React.createElement('button', {
            key: label, onClick: () => requestLocation(i < 2),
            style: { width: '100%', padding: '14px', border: 'none', background: 'transparent', color: i < 2 ? '#2563EB' : '#9CA3AF', fontSize: i < 2 ? '15px' : '14px', fontWeight: i < 2 ? '700' : '500', cursor: 'pointer', borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none' }
          }, label)
        ),
        dotRow(1, '#2563EB', '#DBEAFE')
      )
    );
  }

  // STEP 2 - NOTIFICATIONS
  return React.createElement('div', { style: overlay },
    React.createElement('div', { style: sheet },
      React.createElement('div', { style: { width: '64px', height: '64px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' } },
        React.createElement(Bell, { size: 30, color: '#D97706' })
      ),
      React.createElement('div', { style: { fontSize: '20px', fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: '6px' } },
        'Allow Cleanz24 to send', React.createElement('br'), 'you notifications?'
      ),
      React.createElement('div', { style: { fontSize: '13px', color: '#6B7280', textAlign: 'center', marginBottom: '20px', lineHeight: 1.5 } },
        'Get real-time order updates, delivery alerts, and exclusive offers directly to your phone.'
      ),
      React.createElement('div', { style: { width: '100%', padding: '14px', background: '#F9FAFB', borderRadius: '14px', border: '1px solid #E5E7EB', marginBottom: '22px', display: 'flex', gap: '12px', alignItems: 'center' } },
        React.createElement('div', { style: { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#16A34A,#4ADE80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
          React.createElement(Bell, { size: 18, color: '#FFF' })
        ),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: '13px', fontWeight: '800', color: '#111827' } }, 'Cleanz24 - Order Ready!'),
          React.createElement('div', { style: { fontSize: '11px', color: '#6B7280', marginTop: '2px' } }, 'Your clothes are out for delivery. ETA 20 min')
        )
      ),
      ['Allow', "Don't allow"].map((label, i) =>
        React.createElement('button', {
          key: label, onClick: () => requestNotification(i === 0),
          style: { width: '100%', padding: '14px', border: 'none', background: 'transparent', color: i === 0 ? '#D97706' : '#9CA3AF', fontSize: i === 0 ? '16px' : '14px', fontWeight: i === 0 ? '800' : '500', cursor: 'pointer', borderBottom: i === 0 ? '1px solid #F3F4F6' : 'none' }
        }, label)
      ),
      dotRow(2, '#D97706', '#FEF3C7')
    )
  );
}