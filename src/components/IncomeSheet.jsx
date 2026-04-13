import { useState, useEffect } from 'react';
import { Printer, Calendar, FileText, Trash2 } from 'lucide-react';

// Fetching live data from API
const IncomeSheet = () => {
  const [salesData, setSalesData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(order => ({
          id: order.id,
          itemName: order.items && order.items.length > 0 ? order.items.map(i => i.name).join('\n') : 'Custom Order',
          quantity: order.items && order.items.length > 0 ? order.items.map(i => String(i.quantity).padStart(2, '0')).join('\n') : '-',
          amount: order.amount,
          method: order.method,
          date: order.date,
          time: order.time
        }));
        setSalesData(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredData = salesData.filter(item => item.date >= fromDate && item.date <= toDate);

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalCard = filteredData.filter(i => i.method === 'Card').reduce((sum, item) => sum + item.amount, 0);
  const totalCash = filteredData.filter(i => i.method === 'Cash').reduce((sum, item) => sum + item.amount, 0);
  const totalOther = filteredData.filter(i => i.method === 'Other').reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleClearData = async () => {
    if (window.confirm("Are you sure you want to clear all sales data? This action cannot be undone.")) {
      try {
        await fetch('/api/orders', { method: 'DELETE' });
        setSalesData([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const currentPrintedTime = new Date().toLocaleString();

  return (
    <div className="income-sheet animate-enter">
      <div className="no-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={24} /> Detailed Income Sheet
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Filter by date range and print detailed sales reports.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="save-btn"
              style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ef4444', color: '#fff' }}
              onClick={handleClearData}
            >
              <Trash2 size={18} /> Clear Data
            </button>
            <button
              className="save-btn"
              style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={handlePrint}
            >
              <Printer size={18} /> Print Report
            </button>
          </div>
        </div>

        <div className="filter-controls" style={{ display: 'flex', gap: '1rem', background: 'var(--bg-panel)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="print-only-header" style={{ textAlign: 'center', marginBottom: '2rem', display: 'none' }}>
        <h1 style={{ fontSize: '24pt', color: '#000' }}>Income Report</h1>
        <p style={{ fontSize: '12pt', color: '#333', marginTop: '4px' }}>
          Period: {fromDate} to {toDate}
        </p>
        <p style={{ fontSize: '12pt', color: '#333' }}>
          Generated on: {currentPrintedTime}
        </p>
        <hr style={{ margin: '1rem 0', borderColor: '#ccc' }} />
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '4px', border: '1px solid #ccc', overflow: 'hidden', color: '#333' }}>
        <div style={{ textAlign: 'center', padding: '1.5rem', borderBottom: '1px solid #ccc' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#16487e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: 0 }}>
            <img src="/logo.png" alt="KCH Logo" style={{ height: '50px', objectFit: 'contain' }} /> INCOME SHEET
          </h2>
        </div>
        <table className="income-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead style={{ background: '#225b94', color: '#fff' }}>
            <tr>
              <th style={{ padding: '1rem', borderRight: '1px solid #4a80b4', borderBottom: '1px solid #ccc' }}>Date</th>
              <th style={{ padding: '1rem', borderRight: '1px solid #4a80b4', borderBottom: '1px solid #ccc' }}>Time</th>
              <th style={{ padding: '1rem', borderRight: '1px solid #4a80b4', borderBottom: '1px solid #ccc' }}>Item Name</th>
              <th style={{ padding: '1rem', borderRight: '1px solid #4a80b4', borderBottom: '1px solid #ccc' }}>Quantity</th>
              <th style={{ padding: '1rem', borderRight: '1px solid #4a80b4', borderBottom: '1px solid #ccc' }}>Item Code</th>
              <th style={{ padding: '1rem', borderRight: '1px solid #4a80b4', borderBottom: '1px solid #ccc' }}>Payment Method</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>Price (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8fbfc' }}>
                <td style={{ padding: '1rem', borderRight: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>{row.date}</td>
                <td style={{ padding: '1rem', borderRight: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>{row.time}</td>
                <td style={{ padding: '1rem', borderRight: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{row.itemName}</td>
                <td style={{ padding: '1rem', borderRight: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea', whiteSpace: 'pre-line', lineHeight: '1.5', fontWeight: 600, color: '#16487e' }}>{row.quantity}</td>
                <td style={{ padding: '1rem', borderRight: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>ITM{String(row.id).padStart(3, '0')}</td>
                <td style={{ padding: '1rem', borderRight: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>
                  {row.method === 'Other' ? 'Online' : row.method}
                </td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #eaeaea', fontWeight: 600 }}>
                  {row.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{ background: '#f8fbfc' }}>
            <tr>
              <td colSpan="5" style={{ borderBottom: 'none' }}></td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#555', borderBottom: '1px solid #eaeaea' }}>Cash Payments:</td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555', borderBottom: '1px solid #eaeaea' }}>{totalCash.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} LKR</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ borderBottom: 'none' }}></td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#555', borderBottom: '1px solid #eaeaea' }}>Card Payments:</td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555', borderBottom: '1px solid #eaeaea' }}>{totalCard.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} LKR</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ borderBottom: 'none' }}></td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#555', borderBottom: '1px solid #eaeaea' }}>Online Payments:</td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: '#555', borderBottom: '1px solid #eaeaea' }}>{totalOther.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} LKR</td>
            </tr>
            <tr style={{ background: '#fff' }}>
              <td colSpan="5" style={{ borderBottom: 'none' }}></td>
              <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: 700, fontSize: '1.15rem', color: '#16487e', borderBottom: 'none' }}>
                Total Income:
              </td>
              <td style={{ padding: '1.25rem 1rem', textAlign: 'center', fontWeight: 700, fontSize: '1.25rem', color: '#16487e', borderBottom: 'none' }}>
                {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} <span style={{ fontSize: '0.9rem' }}>LKR</span>
              </td>
            </tr>
          </tfoot>
        </table>
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#555', fontSize: '0.95rem' }}>
          Printed on: {currentPrintedTime}
        </div>
      </div>
    </div>
  );
};

export default IncomeSheet;
