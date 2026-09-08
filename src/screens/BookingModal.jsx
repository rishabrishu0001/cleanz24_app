import React, { useState } from 'react';
import { 
  X, Phone, PhoneCall, MessageCircle, MapPin, 
  Sparkles, Clock, CheckCircle2, ShieldCheck, Truck, Store, 
  Copy, Check, Weight, ArrowRight, Zap, Headphones
} from 'lucide-react';

export default function BookingModal({ 
  location, 
  onClose, 
  selectedStore 
}) {
  const [selectedSlot, setSelectedSlot] = useState('Morning (8 AM - 12 PM)');
  const [copied, setCopied] = useState(false);
  const [callbackNumber, setCallbackNumber] = useState('');
  const [callbackRequested, setCallbackRequested] = useState(false);

  const storeName = selectedStore?.name || 'Cleanz24 Studio';
  const storeAddress = selectedStore?.address || location || 'Doorstep Pickup';

  const slotOptions = [
    { id: 'morning', label: '🌅 Morning', time: '8 AM - 12 PM' },
    { id: 'afternoon', label: '☀️ Afternoon', time: '12 PM - 4 PM' },
    { id: 'evening', label: '🌙 Evening', time: '4 PM - 8 PM' },
    { id: 'express', label: '⚡ 24h Express', time: 'Priority Queue' }
  ];

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+919138004800');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    if (callbackNumber.trim().length >= 10) {
      setCallbackRequested(true);
    }
  };

  const whatsappMessage = selectedStore
    ? `Hello Cleanz24! I would like to schedule a free laundry pickup.\n\n📍 Studio: *${selectedStore.name}*\n🏠 My Address: ${location || 'Noida'}\n⏰ Preferred Slot: ${selectedSlot}\n\nPlease confirm my pickup.`
    : `Hello Cleanz24! I want to book a free laundry pickup.\n\n🏠 Address: *${location || 'Noida'}*\n⏰ Preferred Slot: ${selectedSlot}\n\nPlease call me or confirm the valet arrival.`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet animate-fade-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '14px',
          padding: '20px',
          background: 'var(--bg-card)'
        }}
      >
        <div className="sheet-handle" />

        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(39, 162, 67, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
              border: '1.5px solid var(--border-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-green)',
              boxShadow: '0 4px 12px var(--primary-green-glow)'
            }}>
              <Headphones size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 8px', fontWeight: '800' }}>
                  Direct Helpline
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Zero Wait Time
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '2px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Book Pickup via Call
              </h3>
            </div>
          </div>

          <button 
            className="btn-icon" 
            onClick={onClose} 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%',
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-glass)',
              cursor: 'pointer',
              color: 'var(--text-main)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Active Valet & Location Strip */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '14px',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '12px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <MapPin size={16} color="var(--primary-green)" style={{ flexShrink: 0 }} />
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Pickup Area: </span>
              <strong style={{ color: 'var(--text-main)' }}>
                {selectedStore ? storeName : (location || 'Sector 94, Noida')}
              </strong>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            flexShrink: 0,
            fontSize: '11px',
            color: '#16A34A',
            fontWeight: '700',
            background: 'rgba(34, 197, 94, 0.12)',
            padding: '4px 10px',
            borderRadius: '20px'
          }}>
            <span className="radar-beacon" />
            <span>Valets Nearby</span>
          </div>
        </div>

        {/* ── LUXURY HERO CONCIERGE CALL CARD ── */}
        <div className="concierge-hero-card">
          {/* Subtle Ambient Glow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '30px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: 'var(--primary-green)',
            fontSize: '11.5px',
            fontWeight: '700'
          }}>
            <Sparkles size={13} color="var(--primary-green)" />
            <span>Official Booking Concierge • Open 8 AM – 10 PM</span>
          </div>

          {/* Centerpiece Phone & Copy Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="concierge-subtext">
              Direct Booking & Dispatch Desk
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '10px', 
              marginTop: '6px',
              padding: '8px 16px',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              width: '100%',
              maxWidth: '340px'
            }}>
              <span className="concierge-phone-display">
                +91 91380 04800
              </span>

              <button
                onClick={handleCopyPhone}
                type="button"
                title="Copy Phone Number"
                style={{
                  background: copied ? '#22C55E' : 'rgba(39, 162, 67, 0.2)',
                  border: '1px solid rgba(39, 162, 67, 0.4)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: copied ? '#FFFFFF' : 'var(--primary-green)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
              No clothes counting needed • Valet brings digital scale & laundry bags
            </div>
          </div>

          {/* Action CTAs (Call & WhatsApp) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', width: '100%', marginTop: '4px' }}>
            {/* 1. Primary Call Button */}
            <a 
              href="tel:+919138004800"
              className="call-btn-wiggle"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 22px rgba(34, 197, 94, 0.45)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}
            >
              <PhoneCall size={20} />
              <span>Call Now to Book Pickup</span>
            </a>

            {/* 2. Secondary WhatsApp Button */}
            <a
              href={`https://wa.me/919138004800?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <MessageCircle size={19} />
              <span>Book via WhatsApp (60-Sec Reply)</span>
            </a>
          </div>
        </div>

        {/* Interactive Preferred Slot Picker */}
        <div style={{
          padding: '14px',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--primary-green)" /> Select Preferred Pickup Slot
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              Applies to WhatsApp & Call
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {slotOptions.map((opt) => {
              const isSelected = selectedSlot.includes(opt.time) || selectedSlot.includes(opt.label);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedSlot(`${opt.label} (${opt.time})`)}
                  style={{
                    padding: '9px 10px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid var(--primary-green)' : '1px solid var(--border-glass)',
                    background: isSelected ? 'rgba(39, 162, 67, 0.16)' : 'var(--bg-card-subtle)',
                    color: isSelected ? 'var(--primary-green)' : 'var(--text-main)',
                    fontSize: '12px',
                    fontWeight: isSelected ? '800' : '600',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '2px',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 size={12} color="var(--primary-green)" />}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {opt.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick "Request Call Back" Option */}
        <div style={{
          padding: '14px',
          borderRadius: '16px',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-glass)',
          flexShrink: 0
        }}>
          {callbackRequested ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--primary-green)',
              padding: '6px 4px'
            }}>
              <CheckCircle2 size={20} color="var(--primary-green)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800' }}>Callback Request Received!</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Our dispatch coordinator will call you within 2-3 minutes.
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                Busy right now? Request a Quick Call Back:
              </div>
              <form onSubmit={handleCallbackSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="tel"
                  placeholder="Enter your 10-digit mobile"
                  value={callbackNumber}
                  onChange={(e) => setCallbackNumber(e.target.value)}
                  maxLength={13}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={callbackNumber.trim().length < 10}
                  className="btn-primary"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    opacity: callbackNumber.trim().length < 10 ? 0.6 : 1,
                    cursor: callbackNumber.trim().length < 10 ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Call Me <ArrowRight size={13} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 3 Trust Guarantees */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flexShrink: 0 }}>
          <div style={{
            padding: '10px 8px',
            borderRadius: '12px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-glass)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Truck size={16} color="var(--primary-green)" />
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-main)' }}>Free Pickup</span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>At your doorstep</span>
          </div>

          <div style={{
            padding: '10px 8px',
            borderRadius: '12px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-glass)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Weight size={16} color="var(--primary-green)" />
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-main)' }}>Digital Scale</span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Weighed in front of you</span>
          </div>

          <div style={{
            padding: '10px 8px',
            borderRadius: '12px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-glass)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={16} color="var(--primary-green)" />
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-main)' }}>German Care</span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>ISO Certified quality</span>
          </div>
        </div>

        {/* Bottom Close Action */}
        <button 
          onClick={onClose}
          type="button"
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '12px',
            background: 'transparent',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-muted)',
            fontSize: '12px', 
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '2px',
            flexShrink: 0
          }}
        >
          Cancel / Back to App
        </button>

      </div>
    </div>
  );
}
