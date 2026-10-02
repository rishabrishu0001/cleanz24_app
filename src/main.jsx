import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/* ── Global Error Boundary ──────────────────────────────────────────────────
   Prevents any uncaught render error from crashing the Capacitor WebView.
   Without this, React unmounts the entire tree on error, and Android shows
   the "app has a bug" crash dialog, causing Play Store rejection.
─────────────────────────────────────────────────────────────────────────── */
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[Cleanz24] Uncaught render error:', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#ffffff', fontFamily: "'Outfit', sans-serif",
          padding: '32px 24px', textAlign: 'center'
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', background: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px', boxShadow: '0 8px 28px rgba(22,163,74,0.35)'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>C</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
            Something went wrong
          </div>
          <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px', lineHeight: 1.5, maxWidth: '280px' }}>
            An unexpected error occurred. Please tap below to restart the app.
          </div>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{
              padding: '14px 32px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #16A34A, #15803D)',
              color: '#fff', fontSize: '15px', fontWeight: '800', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(22,163,74,0.35)'
            }}
          >
            Restart Cleanz24
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);

