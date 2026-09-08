import React, { useState } from 'react';
import { X, Send, Bot, Phone, MessageCircle } from 'lucide-react';

export default function SupportChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! 👋 I am your Cleanz24 AI Concierge. How can I help with your laundry, nearby franchise stores, or pickup booking today?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Check my order status',
    'What are your dry cleaning rates?',
    'Call customer support (9138004800)',
    'How do franchise pickups work?'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');

    // Simulate Bot response after 600ms
    setTimeout(() => {
      let botReply = "I'm here to assist! Cleanz24 studios are operated by local franchise partners. You can directly call our central customer support at +91 9138004800 or chat with us on WhatsApp for live order coordination.";
      const lower = query.toLowerCase();

      if (lower.includes('where') || lower.includes('track') || lower.includes('active') || lower.includes('status')) {
        botReply = "Your booking request is assigned to your selected franchise studio. Our central team coordinates directly with the franchise store owner to arrange your pickup. You can call +91 9138004800 or message on WhatsApp for instant confirmation!";
      } else if (lower.includes('rate') || lower.includes('price') || lower.includes('cost')) {
        botReply = "Our rates start at Rs. 49/kg for Wash & Fold, Rs. 45 for formal shirts, Rs. 399 for 2-piece suits, and Rs. 299 for sneaker deep cleans. Free doorstep delivery on orders above Rs. 300!";
      } else if (lower.includes('stain') || lower.includes('wine') || lower.includes('ink')) {
        botReply = "Stain Tip: Do NOT rub red wine or ink! Blot gently with cold water. When scheduling your pickup, mention 'Stain Care' and our master spotters will apply German eco-solvent treatment.";
      } else if (lower.includes('franchise') || lower.includes('owner') || lower.includes('pickup')) {
        botReply = "Cleanz24 stores are operated by trusted franchise owners within your 20 km zone. When you place a booking, our desk team calls the franchise owner and confirms your pickup slot.";
      } else if (lower.includes('call') || lower.includes('phone') || lower.includes('support') || lower.includes('9138004800')) {
        botReply = "Our official customer support number is +91 9138004800. You can reach us via voice call or WhatsApp daily from 7 AM to 10 PM!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet animate-fade-in" style={{ height: '80%', display: 'flex', flexDirection: 'column' }}>
        <div className="sheet-handle" />

        {/* Chat Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3C8B35, #27A243)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 0 15px rgba(39, 162, 67, 0.4)'
            }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px' }}>Cleanz24 AI Concierge</h3>
              <div style={{ fontSize: '11px', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-green)' }} />
                Online 24/7
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a 
              href="tel:+919138004800"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(39, 162, 67, 0.15)', border: '1px solid rgba(39, 162, 67, 0.35)',
                color: 'var(--primary-green)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', textDecoration: 'none'
              }}
              title="Call 9138004800"
            >
              <Phone size={15} />
            </a>
            <a 
              href={`https://wa.me/919138004800?text=${encodeURIComponent('Hi Cleanz24 Support, I need assistance with my laundry booking.')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37, 211, 102, 0.35)',
                color: '#16A34A', display: 'flex', alignItems: 'center',
                justifyContent: 'center', textDecoration: 'none'
              }}
              title="WhatsApp 9138004800"
            >
              <MessageCircle size={15} />
            </a>
            <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #3C8B35, #27A243)' : 'var(--bg-card-subtle)',
                color: msg.sender === 'user' ? '#FFF' : 'var(--text-main)',
                padding: '10px 14px',
                borderRadius: '16px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                fontSize: '13px',
                border: msg.sender === 'bot' ? '1px solid var(--border-glass)' : 'none',
                lineHeight: '1.4'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
          <input 
            type="text" 
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '12px 14px',
              borderRadius: '14px',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => handleSend()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #3C8B35, #27A243)',
              color: '#FFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
