import React, { useState } from 'react';
import { 
  Truck, Clock, CheckCircle2, Phone, MessageSquare, RefreshCw, Sparkles
} from 'lucide-react';

export default function TrackingScreen({ activeOrder, setOrdersHistory }) {
  // If no active order passed, default demo order
  const defaultDemoOrder = {
    id: 'CZ-849201',
    statusStep: 3, // 1 to 6
    statusList: [
      { step: 1, label: 'Order Placed', time: '10:15 AM', desc: 'Booking confirmed & valet assigned' },
      { step: 2, label: 'Valet Picked Up', time: '11:30 AM', desc: 'Garments collected in eco bags' },
      { step: 3, label: 'German Eco Wash & Stain Care', time: '01:45 PM', desc: 'Garments undergoing eco-solvents care', active: true },
      { step: 4, label: 'Steam Pressing & QC', time: 'Pending', desc: 'Hand pressing & quality inspection' },
      { step: 5, label: 'Out for Delivery', time: 'Pending', desc: 'Driver en route to your doorstep' },
      { step: 6, label: 'Delivered Fresh', time: 'Pending', desc: 'Items safely delivered & hung' }
    ],
    items: [
      { name: '2-Piece Navy Suit', qty: 1, status: 'Eco Stain Treated ✓' },
      { name: 'Formal Shirts (Wash & Iron)', qty: 3, status: 'In Steam Pressing' },
      { name: 'White Sneakers', qty: 1, status: 'UV Sterilized ✓' }
    ],
    driver: {
      name: 'David Santos',
      phone: '+1 (555) 782-9021',
      rating: '4.9 ⭐ (840 orders)',
      vehicle: 'Cleanz EV Van #14'
    },
    eta: 'Today by 06:30 PM',
    address: '450 Grand Ave, Apt 12B'
  };

  const [orderState, setOrderState] = useState(activeOrder || defaultDemoOrder);

  // Helper to advance demo status step
  const handleAdvanceStatus = () => {
    const nextStep = orderState.statusStep < 6 ? orderState.statusStep + 1 : 1;
    setOrderState(prev => ({
      ...prev,
      statusStep: nextStep
    }));
  };

  const currentStepInfo = orderState.statusList ? orderState.statusList[orderState.statusStep - 1] : defaultDemoOrder.statusList[2];

  return (
    <div className="animate-fade-in" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px' }}>Live Order Tracking</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time updates from Cleanz24 Studio</div>
        </div>
        
        {/* Advance Demo Button */}
        <button 
          onClick={handleAdvanceStatus}
          style={{
            background: 'rgba(39, 162, 67, 0.18)',
            color: 'var(--primary-green)',
            border: '1px solid var(--border-active)',
            borderRadius: '12px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Click to simulate next tracking status step"
        >
          <RefreshCw size={12} /> Advance Step
        </button>
      </div>

      {/* Real Cleanz24 Studio Cleaning Live Card */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '14px'
      }}>
        <img 
          src="/images/store_interior.jpg" 
          alt="Cleanz24 Studio Interior Processing"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.45) contrast(1.1)'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge badge-green" style={{ marginBottom: '4px' }}>
            <Sparkles size={11} /> CLEANING AT CLEANZ24 STUDIO
          </span>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFF' }}>
            German Eco-Friendly Washing & Stain Care
          </div>
          <div style={{ fontSize: '11px', color: '#DCFCE7' }}>
            Processing on Commercial Steam & Solvent Line #04
          </div>
        </div>
      </div>

      {/* Main Status Progress Card */}
      <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-active)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ORDER ID</span>
            <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              #{orderState.id}
            </div>
          </div>
          <span className="badge badge-green" style={{ fontSize: '12px', padding: '4px 10px' }}>
            {currentStepInfo?.label || 'Processing'}
          </span>
        </div>

        {/* ETA Highlight Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(60, 139, 53, 0.25) 0%, rgba(39, 162, 67, 0.15) 100%)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <Clock size={24} color="var(--primary-green)" />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESTIMATED DELIVERY TIME</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#FFF' }}>
              {orderState.eta || 'Today by 06:30 PM'}
            </div>
          </div>
        </div>

        {/* Vertical Timeline Stepper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
          
          {(orderState.statusList || defaultDemoOrder.statusList).map((s) => {
            const isCompleted = s.step < orderState.statusStep;
            const isCurrent = s.step === orderState.statusStep;

            return (
              <div key={s.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {/* Step Circle Indicator */}
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isCompleted ? '#10B981' : isCurrent ? '#27A243' : 'rgba(255,255,255,0.06)',
                  color: isCompleted || isCurrent ? '#FFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px',
                  boxShadow: isCurrent ? '0 0 15px var(--primary-green)' : 'none',
                  flexShrink: 0,
                  zIndex: 2
                }}>
                  {isCompleted ? <CheckCircle2 size={16} color="#FFF" /> : s.step}
                </div>

                {/* Step Text Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: isCurrent ? '800' : isCompleted ? '700' : '500',
                      color: isCurrent ? 'var(--primary-green)' : isCompleted ? 'var(--text-main)' : 'var(--text-muted)'
                    }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.time}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver & Delivery Valet Card */}
      <div className="glass-card" style={{ padding: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px' }}>
          ASSIGNED VALET DRIVER
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Driver Avatar */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3C8B35, #27A243)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: '800',
            fontSize: '18px',
            boxShadow: '0 0 15px rgba(39, 162, 67, 0.4)'
          }}>
            DS
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>
              {orderState.driver?.name || 'David Santos'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {orderState.driver?.vehicle || 'Cleanz EV Van #14'} • {orderState.driver?.rating || '4.9 ⭐'}
            </div>
          </div>

          {/* Call & Message Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn-icon" 
              onClick={() => alert(`Calling driver at ${orderState.driver?.phone}...`)}
              title="Call Driver"
              style={{ width: '36px', height: '36px', background: 'rgba(39, 162, 67, 0.18)', color: 'var(--primary-green)' }}
            >
              <Phone size={16} />
            </button>
            <button 
              className="btn-icon" 
              onClick={() => alert(`Messaging driver...`)}
              title="Message Driver"
              style={{ width: '36px', height: '36px', background: 'rgba(39, 162, 67, 0.18)', color: 'var(--primary-green)' }}
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* Live GPS Map Simulation Box */}
        <div style={{
          marginTop: '12px',
          height: '110px',
          borderRadius: '14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Simulated Map Grid lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(39, 162, 67, 0.25) 1px, transparent 0)',
            backgroundSize: '16px 16px',
            opacity: 0.7
          }} />

          {/* Driver Pin Pulsing */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="pulse-glow" style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #3C8B35, #27A243)',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Truck size={14} /> Driver 2.4 miles away
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              GPS Live Signal Active
            </div>
          </div>
        </div>
      </div>

      {/* Item Inspection Status Breakdown */}
      <div className="glass-card" style={{ padding: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px' }}>
          GARMENT INSPECTION LOG
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(orderState.items || defaultDemoOrder.items).map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid var(--border-glass)' }}>
              <div>
                <span style={{ fontWeight: '600' }}>{item.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>x{item.qty}</span>
              </div>
              <span className="badge badge-green" style={{ fontSize: '10px' }}>
                {item.status || 'Cleaned ✓'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
