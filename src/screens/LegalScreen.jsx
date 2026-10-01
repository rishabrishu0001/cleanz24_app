import React, { useState } from 'react';
import {
  ShieldCheck, FileText, ChevronLeft, Mail, MapPin,
  Phone, Clock, Lock, Eye, Trash2, UserCheck, Globe,
  AlertCircle, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

/* ─── Accordion Section ─────────────────────────────────────────────────── */
function Section({ icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: '14px',
      border: '1px solid var(--border-glass)',
      background: 'var(--bg-card)',
      marginBottom: '10px',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px', background: 'none', border: 'none',
          cursor: 'pointer', gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(22,163,74,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {icon}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', textAlign: 'left' }}>
            {title}
          </span>
        </div>
        {open
          ? <ChevronUp size={16} color="var(--primary-green)" />
          : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {open && (
        <div style={{
          padding: '0 16px 16px',
          fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function LegalScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' | 'terms'
  const CONTACT_EMAIL = 'happy2helpu@cleanz24.com';
  const EFFECTIVE_DATE = 'September 26, 2026';

  const tabStyle = (active) => ({
    flex: 1, padding: '10px 8px', borderRadius: '10px',
    border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: '700',
    background: active ? '#16A34A' : 'transparent',
    color: active ? '#FFFFFF' : 'var(--text-muted)',
    transition: 'all 0.2s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px 16px 12px',
        borderBottom: '1px solid var(--border-glass)',
        background: 'var(--bg-card)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'var(--bg-card-subtle)', border: '1px solid var(--border-glass)',
            borderRadius: '10px', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0
          }}
        >
          <ChevronLeft size={18} color="var(--text-main)" />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            Legal & Privacy
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
            Cleanz24 — Laundry & Carspa
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{
        display: 'flex', gap: '6px', margin: '14px 16px 0',
        background: 'var(--bg-card-subtle)', borderRadius: '12px',
        padding: '4px', border: '1px solid var(--border-glass)'
      }}>
        <button style={tabStyle(activeTab === 'privacy')} onClick={() => setActiveTab('privacy')}>
          <ShieldCheck size={14} /> Privacy Policy
        </button>
        <button style={tabStyle(activeTab === 'terms')} onClick={() => setActiveTab('terms')}>
          <FileText size={14} /> Terms & Conditions
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '14px 16px 32px', flex: 1 }}>

        {/* Effective Date Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 14px', borderRadius: '12px',
          background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)',
          marginBottom: '14px'
        }}>
          <Clock size={14} color="#16A34A" />
          <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: '700' }}>
            {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'} — Effective {EFFECTIVE_DATE}
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ── PRIVACY POLICY ───────────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (
          <>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              At <strong style={{ color: 'var(--text-main)' }}>Cleanz24 - Laundry & Carspa</strong>, we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you use our app.
            </p>

            <Section icon={<Eye size={15} color="#16A34A" />} title="Information We Collect">
              <p style={{ margin: '0 0 8px' }}><strong>Personal Information:</strong></p>
              <ul style={{ paddingLeft: '16px', margin: '0 0 10px' }}>
                <li>Name and mobile phone number (required for authentication)</li>
                <li>Email address (optional, for order confirmations)</li>
                <li>Delivery address (for pickup & drop service)</li>
              </ul>
              <p style={{ margin: '0 0 8px' }}><strong>Location Information:</strong></p>
              <ul style={{ paddingLeft: '16px', margin: '0' }}>
                <li>GPS coordinates (only when you grant permission) to find nearby studios</li>
                <li>We do NOT track your location in the background</li>
                <li>Location data is used solely to suggest your nearest Cleanz24 store</li>
              </ul>
            </Section>

            <Section icon={<UserCheck size={15} color="#16A34A" />} title="How We Use Your Information">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>To authenticate you via WhatsApp or SMS OTP</li>
                <li>To process and track your laundry/dry-clean orders</li>
                <li>To send order status updates and pickup confirmations</li>
                <li>To provide customer support when requested</li>
                <li>To improve our app and services based on usage patterns</li>
                <li>We do <strong>NOT</strong> sell, rent, or trade your personal data to any third party</li>
              </ul>
            </Section>

            <Section icon={<Globe size={15} color="#16A34A" />} title="Third-Party Services">
              <p style={{ margin: '0 0 8px' }}>We use the following trusted third-party services:</p>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li><strong>Meta WhatsApp Business API</strong> — to send OTP verification codes</li>
                <li><strong>Fast2SMS / MSG91</strong> — for SMS OTP delivery</li>
                <li><strong>OpenStreetMap Nominatim</strong> — for reverse geocoding (no personal data shared)</li>
                <li><strong>MongoDB Atlas</strong> — for secure cloud database storage</li>
                <li><strong>Render.com</strong> — our app hosting provider</li>
              </ul>
            </Section>

            <Section icon={<Lock size={15} color="#16A34A" />} title="Data Security">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>All data is transmitted over HTTPS (TLS encryption)</li>
                <li>OTP codes expire in 5 minutes and are not stored permanently</li>
                <li>Passwords are never stored — we use OTP-only authentication</li>
                <li>Your data is stored in a secured MongoDB Atlas cluster</li>
                <li>We do not store payment card details — all payments are handled externally</li>
              </ul>
            </Section>

            <Section icon={<Trash2 size={15} color="#16A34A" />} title="Your Rights & Account Deletion">
              <p style={{ margin: '0 0 8px' }}>You have the right to:</p>
              <ul style={{ paddingLeft: '16px', margin: '0 0 10px' }}>
                <li><strong>Access</strong> — view all personal data we hold about you</li>
                <li><strong>Correct</strong> — update your name, address, or email anytime via Profile</li>
                <li><strong>Delete</strong> — permanently delete your account and all associated data</li>
                <li><strong>Opt-out</strong> — disable promotional notifications in your account settings</li>
              </ul>
              <p style={{ margin: 0 }}>
                To delete your account: go to <strong>Profile → Delete Account</strong>. All data is permanently erased in accordance with Google Play and Apple App Store privacy guidelines.
              </p>
            </Section>

            <Section icon={<AlertCircle size={15} color="#16A34A" />} title="Children's Privacy">
              Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us personal data, please contact us immediately.
            </Section>

            <Section icon={<CheckCircle2 size={15} color="#16A34A" />} title="Changes to This Policy">
              We may update this Privacy Policy from time to time. When we do, we will update the "Effective Date" at the top. We encourage you to review this policy periodically. Continued use of the app after changes constitutes acceptance of the updated policy.
            </Section>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* ── TERMS & CONDITIONS ───────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'terms' && (
          <>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              By downloading or using the <strong style={{ color: 'var(--text-main)' }}>Cleanz24 - Laundry & Carspa</strong> app, you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>

            <Section icon={<CheckCircle2 size={15} color="#16A34A" />} title="Acceptance of Terms">
              By accessing or using Cleanz24, you confirm that you are at least 18 years old (or have parental consent) and agree to these terms. If you do not agree, please do not use the app.
            </Section>

            <Section icon={<FileText size={15} color="#16A34A" />} title="Our Services">
              <p style={{ margin: '0 0 8px' }}>Cleanz24 provides:</p>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>Laundry, dry cleaning, steam press, and fabric care services</li>
                <li>Doorstep pickup and delivery for garments</li>
                <li>Car spa and detailing services (at select locations)</li>
                <li>Shoe spa and premium fabric restoration</li>
                <li>Membership subscription plans for regular customers</li>
              </ul>
            </Section>

            <Section icon={<UserCheck size={15} color="#16A34A" />} title="User Account Responsibilities">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must provide accurate contact information for pickups and deliveries</li>
                <li>One account per mobile phone number is allowed</li>
                <li>You must not misuse or attempt to reverse-engineer our app</li>
                <li>Any fraudulent activity will result in immediate account suspension</li>
              </ul>
            </Section>

            <Section icon={<Clock size={15} color="#16A34A" />} title="Service Turnaround Times">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li><strong>Same Day:</strong> Steam press (booked before 12 PM)</li>
                <li><strong>24 Hours:</strong> Standard wash & fold, basic dry cleaning</li>
                <li><strong>48 Hours:</strong> Premium dry cleaning, silk & designer fabrics</li>
                <li><strong>72 Hours:</strong> Shoe spa, heavy blankets & comforters</li>
                <li>Express slots are subject to availability and studio capacity</li>
              </ul>
            </Section>

            <Section icon={<AlertCircle size={15} color="#16A34A" />} title="Cancellation & Refunds">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>Orders may be cancelled before valet pickup without charge</li>
                <li>After pickup, a handling fee may apply for cancellations</li>
                <li>Refunds for damaged garments are processed within 7–10 business days</li>
                <li>Refund requests must be raised within 48 hours of delivery</li>
                <li>Refunds are issued to the original payment method</li>
              </ul>
            </Section>

            <Section icon={<ShieldCheck size={15} color="#16A34A" />} title="Liability Limitation">
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                <li>Cleanz24 is not liable for inherent fabric defects or pre-existing damage</li>
                <li>Maximum liability for any garment damage is capped at 10× the service charge for that item</li>
                <li>We are not responsible for delays due to force majeure events (floods, strikes, etc.)</li>
                <li>Customers are responsible for informing us of special fabric care requirements</li>
              </ul>
            </Section>

            <Section icon={<Globe size={15} color="#16A34A" />} title="Intellectual Property">
              All content in this app — including the Cleanz24 logo, brand name, UI design, and service descriptions — is the exclusive intellectual property of Cleanz24 and may not be reproduced, distributed, or modified without written permission.
            </Section>

            <Section icon={<Lock size={15} color="#16A34A" />} title="Governing Law">
              These Terms are governed by the laws of India. Any disputes arising from the use of this app shall be subject to the exclusive jurisdiction of the courts in Noida, Uttar Pradesh, India.
            </Section>

            <Section icon={<CheckCircle2 size={15} color="#16A34A" />} title="Changes to Terms">
              We reserve the right to update these Terms at any time. Continued use of the app after changes constitutes acceptance of the revised terms.
            </Section>
          </>
        )}

        {/* ── Contact Card ── */}
        <div style={{
          marginTop: '20px',
          padding: '18px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0.05) 100%)',
          border: '1.5px solid rgba(22,163,74,0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Mail size={16} color="#16A34A" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
              Contact Us
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={13} color="#16A34A" />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                style={{ fontSize: '13px', color: '#16A34A', fontWeight: '700', textDecoration: 'none' }}
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={13} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Cleanz24 - Laundry & Carspa{'\n'}
                Registered Office: Noida, Uttar Pradesh, India — 201301
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={13} color="var(--text-muted)" />
              <a
                href="tel:+919138004800"
                style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                +91 91380 04800
              </a>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '10px 0 0', lineHeight: '1.5' }}>
            For privacy concerns, data requests, or account deletion support, email us at{' '}
            <strong style={{ color: '#16A34A' }}>{CONTACT_EMAIL}</strong>. We respond within 2 business days.
          </p>
        </div>

      </div>
    </div>
  );
}
