import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ChevronRight, Loader2, AlertTriangle, CheckCircle2, X, Search } from 'lucide-react';

/* ─── Reverse geocode coords to readable address via Nominatim ──────────────── */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) throw new Error('nominatim failed');
    const data = await res.json();
    const a = data.address || {};
    const parts = [
      a.quarter || a.neighbourhood || a.suburb || a.road || a.residential,
      a.city || a.town || a.county || a.state_district
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : (data.display_name?.split(',').slice(0, 3).join(',').trim() || 'Your Location');
  } catch {
    return 'Your Location';
  }
}

/* ─── Forward geocode address string ─────────────────────────────────────────── */
async function searchAddresses(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=in&limit=6&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.map(r => ({
      label: r.display_name,
      short: (r.display_name || '').split(',').slice(0, 3).join(',').trim(),
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon)
    }));
  } catch {
    return [];
  }
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function LocationPermissionScreen({ onLocationDetected, onSkip }) {
  const [phase, setPhase] = useState('ask');   // 'ask' | 'loading' | 'success' | 'denied' | 'search'
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAddresses(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const requestGPS = () => {
    if (!navigator.geolocation) {
      setPhase('denied');
      return;
    }
    setPhase('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        const readable = await reverseGeocode(lat, lng);
        setAddress(readable);
        setPhase('success');
      },
      (_err) => {
        setPhase('denied');
      },
      { timeout: 12000, maximumAge: 60000, enableHighAccuracy: true }
    );
  };

  const confirmLocation = () => {
    localStorage.setItem('cleanz24_location_granted', '1');
    onLocationDetected(address, coords);
  };

  const handleSearchSelect = (result) => {
    localStorage.setItem('cleanz24_location_granted', '1');
    onLocationDetected(result.short || result.label, { lat: result.lat, lng: result.lng });
  };

  /* ─── Styles ───────────────────────────────────────────────────────────────── */
  const C = {
    bg: '#FFFFFF',
    primary: '#16A34A',
    primaryDark: '#15803D',
    primaryLight: '#DCFCE7',
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
    inputBg: '#F9FAFB',
  };

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 1500,
    background: C.bg,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '24px 20px',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
  };

  /* ════════════ PHASE: ASK ════════════ */
  if (phase === 'ask') {
    return (
      <div style={overlay}>
        <style>{`
          @keyframes locRipple { 0%{transform:scale(0.8);opacity:0.4} 100%{transform:scale(2.2);opacity:0} }
          @keyframes locBounce { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
          @keyframes locSpin { to{transform:rotate(360deg)} }
          .loc-allow-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 30px rgba(22,163,74,0.45) !important; }
          .loc-manual-btn:hover { border-color: #16A34A !important; }
        `}</style>

        <img src="/images/logo.jpg" alt="Cleanz24" style={{ height: '50px', marginBottom: '40px', objectFit: 'contain' }} />

        {/* Animated GPS icon */}
        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '36px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `2px solid ${C.primary}`,
              animation: `locRipple 2.2s ease-out ${i * 0.6}s infinite`
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: '20px', borderRadius: '50%',
            background: C.primaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(22,163,74,0.2)'
          }}>
            <MapPin size={34} color={C.primary} strokeWidth={2.5} />
          </div>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: '800', color: C.text, textAlign: 'center', margin: '0 0 12px', letterSpacing: '-0.4px' }}>
          Where should we pick up?
        </h1>
        <p style={{ fontSize: '14.5px', color: C.muted, textAlign: 'center', lineHeight: 1.6, maxWidth: '300px', margin: '0 0 40px' }}>
          Allow location access so we can detect the nearest Cleanz24 studio and estimate your pickup time.
        </p>

        <button
          className="loc-allow-btn"
          onClick={requestGPS}
          style={{
            width: '100%', maxWidth: '340px', padding: '16px', borderRadius: '16px', border: 'none',
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
            color: '#FFFFFF', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 6px 24px rgba(22,163,74,0.35)', marginBottom: '14px',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease', letterSpacing: '-0.2px'
          }}
        >
          <Navigation size={18} /> Enable GPS Location
        </button>

        <button
          className="loc-manual-btn"
          onClick={() => setPhase('search')}
          style={{
            width: '100%', maxWidth: '340px', padding: '14px', borderRadius: '16px',
            border: `1.5px solid ${C.border}`, background: C.inputBg,
            color: C.text, fontSize: '14.5px', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'border-color 0.15s ease', marginBottom: '20px'
          }}
        >
          <Search size={16} /> Enter address manually
        </button>

        <button
          onClick={onSkip}
          style={{ background: 'none', border: 'none', color: C.muted, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Skip for now
        </button>

        <div style={{ display: 'flex', gap: '28px', marginTop: '44px', opacity: 0.65 }}>
          {['Nearest Store', 'Pickup Time', 'Live Tracking'].map(f => (
            <div key={f} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} color={C.primary} />
              </div>
              <span style={{ fontSize: '11px', color: C.muted, fontWeight: '600', whiteSpace: 'nowrap' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ════════════ PHASE: LOADING ════════════ */
  if (phase === 'loading') {
    return (
      <div style={overlay}>
        <style>{`
          @keyframes locPulse { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.3)} 50%{box-shadow:0 0 0 20px rgba(22,163,74,0)} }
          @keyframes locSpin { to{transform:rotate(360deg)} }
        `}</style>
        <img src="/images/logo.jpg" alt="Cleanz24" style={{ height: '48px', marginBottom: '48px', objectFit: 'contain' }} />
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%', background: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px',
          animation: 'locPulse 1.8s ease-in-out infinite'
        }}>
          <Loader2 size={40} color="#16A34A" style={{ animation: 'locSpin 1s linear infinite' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', textAlign: 'center', margin: '0 0 10px' }}>
          Detecting your location...
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center' }}>Please wait, this takes a few seconds</p>
      </div>
    );
  }

  /* ════════════ PHASE: SUCCESS ════════════ */
  if (phase === 'success') {
    return (
      <div style={overlay}>
        <style>{`
          @keyframes locBounceIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
          .loc-confirm-btn:hover { transform: translateY(-2px) !important; }
        `}</style>
        <img src="/images/logo.jpg" alt="Cleanz24" style={{ height: '48px', marginBottom: '36px', objectFit: 'contain' }} />
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%', background: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(22,163,74,0.25)', animation: 'locBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)'
        }}>
          <CheckCircle2 size={44} color="#16A34A" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          Location found! 🎉
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>
          We'll show you the nearest Cleanz24 studio
        </p>

        {/* Detected address card */}
        <div style={{
          width: '100%', maxWidth: '340px', padding: '16px 18px', borderRadius: '16px',
          background: '#F0FDF4', border: '1.5px solid #BBF7D0',
          display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={22} color='#FFF' />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
              📍 Your Location
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827', lineHeight: 1.35 }}>
              {address}
            </div>
          </div>
        </div>

        <button
          className="loc-confirm-btn"
          onClick={confirmLocation}
          style={{
            width: '100%', maxWidth: '340px', padding: '16px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #16A34A, #15803D)',
            color: '#FFFFFF', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            boxShadow: '0 6px 24px rgba(22,163,74,0.35)', marginBottom: '14px',
            transition: 'transform 0.15s ease'
          }}
        >
          Confirm &amp; Find Stores <ChevronRight size={18} />
        </button>

        <button
          onClick={() => setPhase('search')}
          style={{ background: 'none', border: 'none', color: '#16A34A', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }}
        >
          Not your location? Change it
        </button>
      </div>
    );
  }

  /* ════════════ PHASE: DENIED ════════════ */
  if (phase === 'denied') {
    return (
      <div style={overlay}>
        <img src="/images/logo.jpg" alt="Cleanz24" style={{ height: '48px', marginBottom: '36px', objectFit: 'contain' }} />
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%', background: '#FEF9E7',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(234,179,8,0.15)'
        }}>
          <AlertTriangle size={44} color='#EAB308' strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: '21px', fontWeight: '800', color: '#111827', textAlign: 'center', margin: '0 0 10px', letterSpacing: '-0.3px' }}>
          Location Access Denied
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', lineHeight: 1.6, maxWidth: '290px', margin: '0 0 30px' }}>
          Please enable location in your browser, or type your address below.
        </p>
        <button
          onClick={() => setPhase('search')}
          style={{
            width: '100%', maxWidth: '340px', padding: '15px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #16A34A, #15803D)',
            color: '#FFFFFF', fontSize: '15px', fontWeight: '800', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 6px 20px rgba(22,163,74,0.3)', marginBottom: '12px'
          }}
        >
          <Search size={17} /> Search for your address
        </button>
        <button
          onClick={requestGPS}
          style={{
            width: '100%', maxWidth: '340px', padding: '13px', borderRadius: '16px',
            border: '1.5px solid #E5E7EB', background: '#F9FAFB',
            color: '#111827', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px'
          }}
        >
          <Navigation size={16} /> Try GPS again
        </button>
        <button
          onClick={onSkip}
          style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Skip, use default location
        </button>
      </div>
    );
  }

  /* ════════════ PHASE: SEARCH ════════════ */
  return (
    <div style={{ ...overlay, justifyContent: 'flex-start', paddingTop: '20px' }}>
      <style>{`@keyframes locSpin { to{transform:rotate(360deg)} }`}</style>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setPhase('ask')}
          style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F9FAFB', border: '1.5px solid #E5E7EB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <X size={18} color='#6B7280' />
        </button>
        <img src="/images/logo.jpg" alt="Cleanz24" style={{ height: '36px', objectFit: 'contain' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
          Enter your location
        </h2>
        <p style={{ fontSize: '13.5px', color: '#6B7280', margin: '0 0 18px' }}>
          Search your area, sector or landmark
        </p>

        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '4px 14px', borderRadius: '16px',
          background: '#F9FAFB', border: '1.5px solid #E5E7EB',
          marginBottom: '12px'
        }}>
          {isSearching
            ? <Loader2 size={17} color='#6B7280' style={{ animation: 'locSpin 1s linear infinite', flexShrink: 0 }} />
            : <Search size={17} color='#6B7280' style={{ flexShrink: 0 }} />
          }
          <input
            autoFocus
            type="text"
            placeholder="Search area, colony, city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1, padding: '13px 0', background: 'transparent', border: 'none',
              color: '#111827', fontSize: '14.5px', outline: 'none', fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Use GPS */}
        <button
          onClick={requestGPS}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '13px', borderRadius: '14px', border: 'none',
            background: '#DCFCE7', cursor: 'pointer', marginBottom: '16px', transition: 'background 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#BBF7D0'}
          onMouseLeave={e => e.currentTarget.style.background = '#DCFCE7'}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Navigation size={18} color='#FFF' />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#16A34A' }}>Use my current location</div>
            <div style={{ fontSize: '12px', color: '#15803D', opacity: 0.75 }}>Enable GPS for best accuracy</div>
          </div>
          <ChevronRight size={18} color='#16A34A' style={{ marginLeft: 'auto' }} />
        </button>

        {/* Results */}
        {searchResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '340px', overflowY: 'auto' }}>
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSearchSelect(r)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '13px 14px', borderRadius: '14px', border: '1px solid #E5E7EB',
                  background: '#FFFFFF', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#16A34A'; e.currentTarget.style.background = '#F0FDF4'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF'; }}
              >
                <MapPin size={17} color='#9CA3AF' style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827', lineHeight: 1.3 }}>
                    {r.short.split(',')[0]}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', lineHeight: 1.35 }}>
                    {r.label.split(',').slice(1, 4).join(',').trim()}
                  </div>
                </div>
                <ChevronRight size={16} color='#D1D5DB' style={{ marginLeft: 'auto', flexShrink: 0, marginTop: '3px' }} />
              </button>
            ))}
          </div>
        )}

        {searchQuery.length > 1 && !isSearching && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '28px', color: '#6B7280', fontSize: '13.5px' }}>
            No results found. Try a different area name.
          </div>
        )}
      </div>
    </div>
  );
}
