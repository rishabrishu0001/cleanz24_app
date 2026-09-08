import React from 'react';
import { 
  ShieldCheck, Award, Crown, MessageCircle, Sparkles
} from 'lucide-react';

export default function WalletScreen({ onStartBooking }) {
  return (
    <div className="animate-fade-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Membership Packages
          </h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
            Save more with every wash — choose your plan
          </div>
        </div>
        <span className="badge badge-green" style={{ fontSize: '11px', padding: '4px 10px' }}>
          Members Only
        </span>
      </div>

      {/* Plans List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
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
              padding: '11px', borderRadius: '12px',
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
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

      </div>

      {/* Compare / Guarantee note */}
      <div style={{
        marginTop: '6px',
        padding: '14px',
        borderRadius: '14px',
        background: 'rgba(39, 162, 67, 0.08)',
        border: '1px dashed rgba(39, 162, 67, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Sparkles size={20} color="var(--primary-green)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          All plans include door-step pickup, contactless delivery, German eco-detergents, and guaranteed satisfaction.
        </div>
      </div>

    </div>
  );
}
