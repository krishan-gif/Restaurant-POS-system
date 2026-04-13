import { useState } from 'react';
import { CheckCircle2, CreditCard, Banknote, Smartphone } from 'lucide-react';

const CheckoutModal = ({ onClose, onConfirm }) => {
  const [step, setStep] = useState(1); // 1 = Select Method, 2 = Success

  const handlePayment = (method) => {
    setStep(2);
    setTimeout(() => {
      onConfirm(method);
    }, 2000); // Auto close after 2s
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 600 }}>Select Payment Method</h2>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <button className="payment-btn" onClick={() => handlePayment('Card')} style={btnStyle}>
                <CreditCard size={24} />
                <span>Credit / Debit Card</span>
              </button>
              <button className="payment-btn" onClick={() => handlePayment('Cash')} style={btnStyle}>
                <Banknote size={24} />
                <span>Cash</span>
              </button>
              <button className="payment-btn" onClick={() => handlePayment('Other')} style={btnStyle}>
                <Smartphone size={24} />
                <span>Digital Wallet (Apple Pay / GPay)</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}
            >
              Cancel
            </button>
          </>
        ) : (
          <div className="animate-enter">
            <CheckCircle2 className="success-icon" />
            <h2 style={{ marginBottom: '1rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Printing receipt...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '16px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-main)',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

export default CheckoutModal;
