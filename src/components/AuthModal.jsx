import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone, X, ArrowRight, ShieldCheck, MessageCircle,
  Loader2, Eye, EyeOff, User, MapPin, ChevronLeft, RefreshCw
} from 'lucide-react';
import api from '../services/api.js';

/* WhatsApp & SMS icons as inline SVGs */
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SmsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="10" x2="15" y2="10"/>
    <line x1="9" y1="14" x2="13" y2="14"/>
  </svg>
);

/* ─── Inline styles ─────────────────────────────────────────────────────────── */
const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    animation: 'authFadeIn 0.25s ease'
  },
  card: {
    width: '100%', maxWidth: '420px',
    borderRadius: '24px',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.03)',
    padding: '28px 24px 24px',
    position: 'relative',
    overflow: 'hidden',
    animation: 'authSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  glowDot: {
    position: 'absolute', width: '180px', height: '180px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
    top: '-60px', right: '-60px', pointerEvents: 'none'
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'
  },
  logoImg: {
    height: '46px',
    width: 'auto',
    borderRadius: '8px',
    objectFit: 'contain',
    display: 'block',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  logoText: {
    fontSize: '19px', fontWeight: '900', color: '#111827',
    letterSpacing: '-0.3px', lineHeight: '1.2'
  },
  logoSub: {
    fontSize: '10.5px', color: '#16A34A', fontWeight: '700',
    letterSpacing: '0.4px', textTransform: 'uppercase', marginTop: '2px'
  },
  heading: { fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 6px', letterSpacing: '-0.3px' },
  subtext: { fontSize: '13px', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5 },
  tabs: {
    display: 'flex', background: '#F3F4F6',
    borderRadius: '12px', padding: '3px', marginBottom: '18px',
    border: '1px solid #E5E7EB'
  },
  tab: (active) => ({
    flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: '700', transition: 'all 0.2s ease',
    background: active ? '#16A34A' : 'transparent',
    color: active ? '#FFFFFF' : '#4B5563',
    boxShadow: active ? '0 2px 8px rgba(22,163,74,0.25)' : 'none'
  }),
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#F9FAFB', border: '1.5px solid #E5E7EB',
    borderRadius: '14px', padding: '4px 14px', marginBottom: '12px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  },
  inputWrapActive: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#FFFFFF', border: '1.5px solid #16A34A',
    boxShadow: '0 0 0 3px rgba(22,163,74,0.12)',
    borderRadius: '14px', padding: '4px 14px', marginBottom: '12px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  },
  input: {
    flex: 1, padding: '12px 0', background: 'transparent', border: 'none',
    color: '#111827', fontSize: '14px', outline: 'none', fontFamily: 'inherit'
  },
  phonePrefix: { fontSize: '15px', fontWeight: '800', color: '#16A34A', minWidth: '28px' },
  whatsappBadge: {
    fontSize: '11px', padding: '3px 8px', borderRadius: '6px',
    background: '#DCFCE7', color: '#15803D', fontWeight: '700',
    border: '1px solid #BBF7D0', whiteSpace: 'nowrap'
  },
  btnPrimary: {
    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
    color: '#FFFFFF', fontSize: '15px', fontWeight: '800', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    marginTop: '6px', transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(22,163,74,0.35)',
    letterSpacing: '-0.2px'
  },
  btnSecondary: {
    width: '100%', padding: '11px', borderRadius: '12px',
    border: '1px solid #E5E7EB', background: '#F9FAFB',
    color: '#4B5563', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s ease'
  },
  errorBox: {
    padding: '10px 14px', borderRadius: '10px',
    background: '#FEF2F2', border: '1px solid #FECACA',
    color: '#DC2626', fontSize: '12px', fontWeight: '600',
    marginBottom: '12px', textAlign: 'center', animation: 'authShake 0.4s ease'
  },
  closeBtn: {
    position: 'absolute', right: '16px', top: '16px',
    background: '#F3F4F6', border: '1px solid #E5E7EB',
    color: '#6B7280', borderRadius: '50%', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s ease'
  },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    background: 'none', border: 'none', color: '#4B5563',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '0', marginBottom: '18px',
    transition: 'color 0.2s ease'
  },
  guestBtn: {
    background: 'none', border: 'none', color: '#6B7280',
    fontSize: '12.5px', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline',
    marginTop: '14px', display: 'block', width: '100%', textAlign: 'center',
    transition: 'color 0.2s ease'
  },
  secBadge: {
    marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', fontSize: '11px', color: '#6B7280'
  },
  // OTP specific
  otpRow: { display: 'flex', gap: '10px', justifyContent: 'center', margin: '8px 0 20px' },
  otpBox: (filled, focused) => ({
    width: '46px', height: '56px', borderRadius: '14px',
    background: filled ? '#F0FDF4' : focused ? '#FFFFFF' : '#F9FAFB',
    borderWidth: '2px', borderStyle: 'solid',
    borderColor: filled ? '#16A34A' : focused ? '#16A34A' : '#D1D5DB',
    boxShadow: focused ? '0 0 0 3px rgba(22,163,74,0.15)' : 'none',
    color: '#111827', fontSize: '22px', fontWeight: '800', textAlign: 'center',
    outline: 'none', cursor: 'text', transition: 'all 0.15s ease',
    fontFamily: 'inherit'
  }),
  resendTimer: { textAlign: 'center', fontSize: '12.5px', color: '#6B7280', margin: '0 0 16px' },
  resendBtn: {
    background: 'none', border: 'none', color: '#16A34A',
    fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', padding: '0'
  },
  waNotice: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px', borderRadius: '12px',
    background: '#F0FDF4', border: '1px solid #BBF7D0',
    fontSize: '12.5px', color: '#15803D', fontWeight: '600', marginBottom: '20px'
  },
  switchLink: {
    background: 'none', border: 'none', color: '#16A34A',
    fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', marginTop: '12px',
    display: 'block', textAlign: 'center'
  }
};

/* ─── OTP Box Component ──────────────────────────────────────────────────────── */
function OtpInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);
  const [focusedIdx, setFocusedIdx] = useState(0);

  useEffect(() => {
    refs[0]?.current?.focus();
  }, []);

  const handleKey = (idx, e) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = digits.map((d, i) => i === idx ? '' : d).join('').padEnd(6, '').slice(0, 6);
        onChange(next.trimEnd());
      } else if (idx > 0) {
        refs[idx - 1]?.current?.focus();
        const next = digits.map((d, i) => i === idx - 1 ? '' : d).join('').slice(0, 6);
        onChange(next.trimEnd());
      }
    }
  };

  const handleChange = (idx, e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    // Handle paste
    if (raw.length > 1) {
      const filled = raw.slice(0, 6);
      onChange(filled);
      const nextFocus = Math.min(filled.length, 5);
      refs[nextFocus]?.current?.focus();
      return;
    }
    const char = raw[0];
    const next = digits.map((d, i) => i === idx ? char : d).join('');
    onChange(next.slice(0, 6));
    if (idx < 5) refs[idx + 1]?.current?.focus();
  };

  return (
    <div style={S.otpRow}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={d}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onFocus={() => setFocusedIdx(i)}
          onBlur={() => setFocusedIdx(-1)}
          style={S.otpBox(!!d, focusedIdx === i)}
        />
      ))}
    </div>
  );
}

/* ─── Main AuthModal ─────────────────────────────────────────────────────────── */
export default function AuthModal({ isOpen, onClose, onLoginSuccess, onOpenAdmin }) {
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login'
  const [step, setStep] = useState('form');           // 'form' | 'otp'
  const [otpChannel, setOtpChannel] = useState('whatsapp'); // 'whatsapp' | 'sms'

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');

  // Admin stealth
  const [adminPwd, setAdminPwd] = useState('');
  const [showAdminPwd, setShowAdminPwd] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);

  // Focus tracking for input styling
  const [focused, setFocused] = useState('');

  const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
  const isAdmin = cleanPhone === '9355395911';
  const maskedPhone = cleanPhone.length >= 4
    ? `+91 XXXXX ${cleanPhone.slice(-5)}`
    : '+91 XXXXXXXXXX';

  if (!isOpen) return null;

  // ── Resend timer ──
  const startResendTimer = () => {
    setResendSeconds(30);
    const id = setInterval(() => {
      setResendSeconds(s => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  // ── Step 1: Send OTP ──
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (authMode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (isAdmin) {
      if (!adminPwd) { setError('Enter your security password.'); return; }
      if (adminPwd !== 'Cleanz24@1212') { setError('Incorrect security password.'); return; }
    }

    // If user is trying to log in, verify that the account already exists before sending OTP
    if (authMode === 'login' && !isAdmin) {
      setLoading(true);
      try {
        const checkRes = await api.auth.checkUser(cleanPhone);
        if (!checkRes?.exists) {
          setLoading(false);
          setAuthMode('signup');
          setError('No account found with this number. Please sign up to create your account.');
          return;
        }
      } catch (err) {
        console.warn('Could not pre-check user existence:', err);
      }
    }

    setLoading(true);
    try {
      if (otpChannel === 'whatsapp') {
        await api.auth.sendWhatsAppOtp(cleanPhone);
      } else {
        await api.auth.sendSmsOtp(cleanPhone);
      }
    } catch (_) {
      // proceed anyway — OTP will come via chosen channel
    } finally {
      setLoading(false);
      setStep('otp');
      setOtp('');
      startResendTimer();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (otp.length < 6) { setError('Please enter the 6-digit code.'); return; }

    setLoading(true);
    const enteredName = name.trim();
    const finalEmail = `${cleanPhone}@cleanz24.com`;

    // Admin stealth bypass
    if (isAdmin) {
      try {
        await api.auth.verifyWhatsAppOtp({ phone: cleanPhone, otp, name: 'Cleanz24 Administrator', email: 'admin@cleanz24.com' });
      } catch (_) {}
      setLoading(false);
      onClose();
      if (onOpenAdmin) onOpenAdmin();
      return;
    }

    try {
      const verifyFn = otpChannel === 'whatsapp'
        ? api.auth.verifyWhatsAppOtp
        : api.auth.verifySmsOtp;
      const res = await verifyFn({
        phone: cleanPhone,
        otp,
        mode: authMode,
        ...(enteredName ? { name: enteredName } : {}),
        email: finalEmail,
        address: address || 'Sector 94, Noida'
      });

      // Prefer: enteredName > server returned user name > 'Customer'
      const returnedName = res?.user?.name;
      const resolvedName = (enteredName && enteredName !== 'Customer')
        ? enteredName
        : (returnedName && returnedName !== 'Customer' ? returnedName : 'Customer');

      const userToSave = {
        ...(res?.user || {}),
        name: resolvedName,
        phone: `+91 ${cleanPhone}`,
        email: res?.user?.email || finalEmail,
        isLoggedIn: true
      };
      if (onLoginSuccess) onLoginSuccess(userToSave);
      onClose();
    } catch (err) {
      const errorMsg = err?.message || err?.error || '';

      // Handle "no account found" — switch user to signup
      if (authMode === 'login' && (errorMsg.includes('No account found') || errorMsg.includes('sign up'))) {
        switchMode('signup');
        setPhone(cleanPhone);
        setError('No account found with this number. Please sign up first.');
        setLoading(false);
        return;
      }

      // Allow demo OTPs only for signup mode (not login for unregistered users)
      const allowed = ['123456', '1234', '941200'];
      if (allowed.includes(otp.trim()) && authMode === 'signup') {
        const fallbackName = (enteredName && enteredName !== 'Customer') ? enteredName : 'Customer';
        const userToSave = {
          id: 'usr_' + Date.now(),
          name: fallbackName,
          phone: `+91 ${cleanPhone}`,
          email: finalEmail,
          address: address || 'Sector 94, Noida',
          isLoggedIn: true
        };
        if (onLoginSuccess) onLoginSuccess(userToSave);
        onClose();
      } else if (allowed.includes(otp.trim()) && authMode === 'login') {
        // For demo OTP in login mode — check if user exists without creating
        try {
          const checkRes = await api.auth.checkUser(cleanPhone);
          if (checkRes?.exists && checkRes?.user) {
            if (onLoginSuccess) onLoginSuccess({ ...checkRes.user, isLoggedIn: true });
            onClose();
          } else {
            switchMode('signup');
            setPhone(cleanPhone);
            setError('No account found with this number. Please sign up first.');
          }
        } catch (_) {
          switchMode('signup');
          setPhone(cleanPhone);
          setError('No account found with this number. Please sign up first.');
        }
      } else {
        setError(`Incorrect OTP. Please check your ${otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS messages'} and try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setStep('form');
    setError('');
    setOtp('');
    setPhone('');
    setName('');
    setAdminPwd('');
    setOtpChannel('whatsapp');
  };

  return (
    <>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes authFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes authShake {
          0%,100% { transform: translateX(0) }
          20%,60%  { transform: translateX(-6px) }
          40%,80%  { transform: translateX(6px) }
        }
        .auth-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.45) !important;
        }
        .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
        .auth-back-btn:hover { color: #16A34A !important; }
        .auth-close-btn:hover { background: #E5E7EB !important; color: #111827 !important; }
        .auth-switch:hover { color: #15803D !important; text-decoration: underline; }
        .auth-resend:hover { color: #15803D !important; text-decoration: underline; }
        .auth-guest:hover { color: #111827 !important; }
        .auth-input-wrap:focus-within { border-color: #16A34A !important; background: #FFFFFF !important; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12) !important; }
      `}</style>

      <div style={S.overlay}>
        <div style={S.card}>
          {/* Glow decoration */}
          <div style={S.glowDot} />

          {/* Close button */}
          <button className="auth-close-btn" onClick={onClose} style={S.closeBtn}>
            <X size={15} />
          </button>

          {/* Logo */}
          <div style={S.logo}>
            <img 
              src="/images/logo.jpg" 
              alt="Cleanz24 Logo" 
              style={S.logoImg} 
            />
            <div>
              <div style={S.logoText}>Cleanz24</div>
              <div style={S.logoSub}>Premium Laundry And Drycleaning</div>
            </div>
          </div>

          {/* ── FORM STEP ────────────────────────────────────── */}
          {step === 'form' && (
            <>
              <h2 style={S.heading}>
                {authMode === 'signup' ? 'Create your account' : 'Welcome back!'}
              </h2>
              <p style={S.subtext}>
                {authMode === 'signup'
                  ? 'Join 10,000+ happy customers. Verify via WhatsApp OTP.'
                  : 'Log in to track orders, manage pickups & more.'}
              </p>

              {/* Mode tabs */}
              <div style={S.tabs}>
                <button style={S.tab(authMode === 'signup')} onClick={() => switchMode('signup')}>
                  New Customer
                </button>
                <button style={S.tab(authMode === 'login')} onClick={() => switchMode('login')}>
                  Log In
                </button>
              </div>

              {/* Error */}
              {error && <div style={S.errorBox}>{error}</div>}

              <form onSubmit={handleSendOtp} autoComplete="on">
                {/* Name */}
                {authMode === 'signup' ? (
                  <div
                    className="auth-input-wrap"
                    style={focused === 'name' ? S.inputWrapActive : S.inputWrap}
                  >
                    <User size={16} color={focused === 'name' ? '#16A34A' : '#9CA3AF'} />
                    <input
                      type="text"
                      placeholder="Your full name *"
                      value={name}
                      autoComplete="name"
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      style={S.input}
                      required
                    />
                  </div>
                ) : (
                  <div
                    className="auth-input-wrap"
                    style={focused === 'name' ? S.inputWrapActive : S.inputWrap}
                  >
                    <User size={16} color={focused === 'name' ? '#16A34A' : '#9CA3AF'} />
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      autoComplete="name"
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                      style={S.input}
                    />
                  </div>
                )}

                {/* Phone */}
                <div
                  className="auth-input-wrap"
                  style={focused === 'phone' ? S.inputWrapActive : S.inputWrap}
                >
                  <span style={S.phonePrefix}>+91</span>
                  <input
                    type="tel"
                    placeholder="WhatsApp number *"
                    value={cleanPhone}
                    autoComplete="tel"
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused('')}
                    style={{ ...S.input, fontWeight: '700', fontSize: '15px' }}
                    required
                    inputMode="numeric"
                  />
                  <span style={S.whatsappBadge}>WhatsApp</span>
                </div>

                {/* Admin stealth password */}
                {isAdmin && (
                  <div
                    className="auth-input-wrap"
                    style={{ ...S.inputWrapActive, marginTop: '-2px' }}
                  >
                    <input
                      type={showAdminPwd ? 'text' : 'password'}
                      placeholder="Security password"
                      value={adminPwd}
                      onChange={e => setAdminPwd(e.target.value)}
                      style={S.input}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPwd(v => !v)}
                      style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                    >
                      {showAdminPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}

                {/* Address (signup only, optional) */}
                {authMode === 'signup' && (
                  <div
                    className="auth-input-wrap"
                    style={focused === 'addr' ? S.inputWrapActive : S.inputWrap}
                  >
                    <MapPin size={16} color={focused === 'addr' ? '#16A34A' : '#9CA3AF'} />
                    <input
                      type="text"
                      placeholder="Delivery address / Sector (optional)"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      onFocus={() => setFocused('addr')}
                      onBlur={() => setFocused('')}
                      style={S.input}
                    />
                  </div>
                )}

                {/* OTP Channel Selector */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', marginBottom: '8px', letterSpacing: '0.05em' }}>RECEIVE OTP VIA</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setOtpChannel('whatsapp')}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: '12px', border: '2px solid',
                        borderColor: otpChannel === 'whatsapp' ? '#16A34A' : '#E5E7EB',
                        background: otpChannel === 'whatsapp' ? '#F0FDF4' : '#F9FAFB',
                        color: otpChannel === 'whatsapp' ? '#16A34A' : '#6B7280',
                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.2s ease',
                        boxShadow: otpChannel === 'whatsapp' ? '0 0 0 3px rgba(22,163,74,0.1)' : 'none'
                      }}
                    >
                      <WhatsAppIcon /> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpChannel('sms')}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: '12px', border: '2px solid',
                        borderColor: otpChannel === 'sms' ? '#3B82F6' : '#E5E7EB',
                        background: otpChannel === 'sms' ? '#EFF6FF' : '#F9FAFB',
                        color: otpChannel === 'sms' ? '#3B82F6' : '#6B7280',
                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.2s ease',
                        boxShadow: otpChannel === 'sms' ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none'
                      }}
                    >
                      <SmsIcon /> SMS
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  className="auth-btn-primary"
                  style={S.btnPrimary}
                  disabled={loading}
                >
                  {loading
                    ? <><Loader2 size={17} className="animate-spin" /> Sending OTP...</>
                    : otpChannel === 'whatsapp'
                      ? <><WhatsAppIcon /> Send WhatsApp OTP <ArrowRight size={16} /></>
                      : <><SmsIcon /> Send SMS OTP <ArrowRight size={16} /></>}
                </button>
              </form>

              {/* Switch mode link */}
              {authMode === 'signup' ? (
                <button className="auth-switch" style={S.switchLink} onClick={() => switchMode('login')}>
                  Already have an account? Log In →
                </button>
              ) : (
                <button className="auth-switch" style={S.switchLink} onClick={() => switchMode('signup')}>
                  New here? Create account →
                </button>
              )}

              {/* Guest */}
              <button className="auth-guest" style={S.guestBtn} onClick={onClose}>
                Skip & browse as Guest →
              </button>
            </>
          )}

          {/* ── OTP STEP ─────────────────────────────────────── */}
          {step === 'otp' && (
            <>
              {/* Back button */}
              <button
                className="auth-back-btn"
                style={S.backBtn}
                onClick={() => { setStep('form'); setOtp(''); setError(''); }}
              >
                <ChevronLeft size={16} /> Change number
              </button>

              <h2 style={S.heading}>Verify your number</h2>
              <p style={S.subtext}>
                We sent a 6-digit code via {otpChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'}<br />
                <span style={{ color: '#16A34A', fontWeight: '700' }}>{maskedPhone}</span>
              </p>

              {/* Channel notice */}
              <div style={{
                ...S.waNotice,
                background: otpChannel === 'whatsapp' ? '#F0FDF4' : '#EFF6FF',
                border: `1px solid ${otpChannel === 'whatsapp' ? '#BBF7D0' : '#BFDBFE'}`,
                color: otpChannel === 'whatsapp' ? '#15803D' : '#1D4ED8'
              }}>
                {otpChannel === 'whatsapp' ? <WhatsAppIcon /> : <SmsIcon />}
                <span>
                  {otpChannel === 'whatsapp'
                    ? 'Check your WhatsApp — code expires in 5 minutes'
                    : 'Check your SMS messages — code expires in 5 minutes'}
                </span>
              </div>

              {/* Error */}
              {error && <div style={S.errorBox}>{error}</div>}

              {/* 6-box OTP */}
              <OtpInput value={otp} onChange={setOtp} />

              {/* Resend */}
              <div style={S.resendTimer}>
                {resendSeconds > 0
                  ? <>Resend code in <strong style={{ color: '#16A34A' }}>{resendSeconds}s</strong></>
                  : (
                    <button
                      className="auth-resend"
                      style={S.resendBtn}
                      onClick={(e) => { handleSendOtp(e); }}
                    >
                      <RefreshCw size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Resend WhatsApp code
                    </button>
                  )}
              </div>

              {/* Verify CTA */}
              <form onSubmit={handleVerifyOtp}>
                <button
                  type="submit"
                  className="auth-btn-primary"
                  style={S.btnPrimary}
                  disabled={loading || otp.length < 6}
                >
                  {loading
                    ? <><Loader2 size={17} className="animate-spin" /> Verifying...</>
                    : <>Verify & Enter App <ArrowRight size={16} /></>}
                </button>
              </form>

              {/* Guest */}
              <button className="auth-guest" style={S.guestBtn} onClick={onClose}>
                Skip & browse as Guest →
              </button>
            </>
          )}

          {/* Security badge */}
          <div style={S.secBadge}>
            <ShieldCheck size={13} color="#16A34A" />
            <span>Secured via 256-Bit SSL &amp; WhatsApp Verification</span>
          </div>
        </div>
      </div>
    </>
  );
}