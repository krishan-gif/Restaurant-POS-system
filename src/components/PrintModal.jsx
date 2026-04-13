import { useState } from 'react';
import { Printer, Calendar as CalendarIcon, Clock } from 'lucide-react';

const PrintModal = ({ onClose, onPrint }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('23:59');

  const handlePrint = () => {
    onPrint({ date, time });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content print-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <Printer size={28} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Print Income Sheet</h2>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Select the end date and time for the income report you wish to export and print.
        </p>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={16} /> Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> Time
          </label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={onClose}
            style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={handlePrint}
            className="save-btn" 
            style={{ flex: 1, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Printer size={18} /> Print Sheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
